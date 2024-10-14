import { useQuery } from "@tanstack/react-query";

import { getGeocodedLocation } from "@/src/services/location";
import { getWeather } from "@/src/services/weather";
import { cn } from "@/src/utils";

import CalendarWidget from "./partials/CalendarWidget";
import LoadingState from "./partials/LoadingState";
import WeatherWidget from "./partials/WeatherWidget";

type Props = {
  className?: string;
};

const InfoWidget = () => {
  const { isError: isLocationError, data: locationData } = useQuery({
    queryFn: getGeocodedLocation,
    queryKey: ["location"],
  });

  const {
    isPending,
    isError,
    data: weatherData,
  } = useQuery({
    enabled: !!locationData,
    queryFn: () =>
      getWeather({
        latitude: locationData?.latitude,
        longitude: locationData?.longitude,
      }),
    queryKey: ["weather", locationData?.latitude, locationData?.longitude],
  });

  if (isLocationError) {
    return <CalendarWidget />;
  }

  if (isPending) {
    return <LoadingState />;
  }

  if (isError) {
    return <span>Unable to display weather information.</span>;
  }

  return (
    <>
      {weatherData && (
        <>
          <WeatherWidget weatherData={weatherData} area={locationData?.area} />
          <div className="h-10 w-0.5 rounded bg-black/5" />
        </>
      )}
      <CalendarWidget />
    </>
  );
};

const Container = ({ className }: Props) => (
  <div className={cn("flex gap-4 items-center duration-500", className)}>
    <InfoWidget />
  </div>
);

export default Container;
