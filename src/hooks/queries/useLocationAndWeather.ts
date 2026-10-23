import { useQuery } from "@tanstack/react-query";

import { useSettings } from "@/src/hooks/useSettings";
import { getGeocodedLocation } from "@/src/services/location";
import { GpsError } from "@/src/services/location/getLocation";
import { getActiveSavedLocation } from "@/src/services/location/resolveLocation";
import { GpsFailure } from "@/src/services/location/types";
import { PERSIST_DURATION } from "@/src/services/persistQueries";
import { getWeather } from "@/src/services/weather";
import { mapWeather } from "@/src/services/weather/mapWeather";

type Status = "loading" | "ready" | "locationError" | "weatherError";

export const useLocationAndWeather = () => {
  const { data: settings } = useSettings();
  const savedLocation = settings && getActiveSavedLocation(settings.location);

  /*
   * Only asks for GPS once the settings say it's needed: with a saved place
   * active, the browser never prompts for location access.
   */
  const gpsQuery = useQuery({
    enabled: Boolean(settings) && !savedLocation,
    queryFn: getGeocodedLocation,
    queryKey: ["location", "gps"],
    staleTime: PERSIST_DURATION,
    // The service retries by itself, and a denied permission shouldn't be retried.
    retry: false,
    // A failed lookup is retried by the Retry button or the next new tab.
    refetchOnWindowFocus: false,
    // Reading the stored settings doesn't need a connection.
    networkMode: "always",
  });

  const locationData = savedLocation ?? gpsQuery.data;

  const weatherQuery = useQuery({
    enabled: Boolean(locationData),
    queryFn: () =>
      getWeather({
        latitude: locationData!.latitude,
        longitude: locationData!.longitude,
      }),
    staleTime: PERSIST_DURATION,
    select: mapWeather,
    queryKey: [
      "weather",
      { latitude: locationData?.latitude, longitude: locationData?.longitude },
    ],
    retry: 1,
    // Fail when offline, rather than showing the loader indefinitely.
    networkMode: "always",
  });

  const getStatus = (): Status => {
    if (!locationData) {
      return gpsQuery.isError && !gpsQuery.isFetching
        ? "locationError"
        : "loading";
    }

    if (weatherQuery.isError) {
      return "weatherError";
    }

    return weatherQuery.data ? "ready" : "loading";
  };

  const status = getStatus();

  const getGpsFailure = (): GpsFailure | undefined => {
    if (status !== "locationError") {
      return undefined;
    }

    return gpsQuery.error instanceof GpsError
      ? gpsQuery.error.reason
      : "unavailable";
  };

  return {
    status,
    data: {
      weatherData: weatherQuery.data,
      locationData,
    },
    /** Why GPS failed, when `status` is `locationError`. */
    gpsFailure: getGpsFailure(),
    retryLocation: () => gpsQuery.refetch(),
  };
};
