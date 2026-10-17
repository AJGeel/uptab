import { useQuery } from "@tanstack/react-query";

import { getGeocodedLocation } from "@/src/services/location";
import { PERSIST_DURATION } from "@/src/services/persistQueries";
import { getWeather } from "@/src/services/weather";
import { mapWeather } from "@/src/services/weather/mapWeather";

export const useLocationAndWeather = () => {
  const {
    isError: isLocationError,
    isPending: isLocationPending,
    data: locationData,
  } = useQuery({
    queryFn: getGeocodedLocation,
    queryKey: ["location"],
    staleTime: PERSIST_DURATION,
  });

  const {
    isPending: isWeatherPending,
    isError: isWeatherError,
    data: weatherData,
  } = useQuery({
    enabled: Boolean(locationData),
    queryFn: () =>
      getWeather({
        latitude: locationData!.latitude,
        longitude: locationData!.longitude,
      }),
    staleTime: PERSIST_DURATION,
    select: mapWeather,
    queryKey: ["weather", locationData],
  });

  return {
    data: {
      weatherData,
      locationData,
    },
    isPending: {
      isLocationPending,
      isWeatherPending,
    },
    isError: {
      isWeatherError,
      isLocationError,
    },
  };
};
