import { useQuery } from "@tanstack/react-query";

import { getLocation } from "@/src/services/location";
import { getWeather, mapWeatherCode } from "@/src/services/weather";
import { cn, formatToday, formatWeekNumber } from "@/src/utils";

import Link from "./Link";
import Spinner from "./Spinner";

type Props = {
  className?: string;
};

const InfoWidget = () => {
  const { data: locationData } = useQuery({
    queryFn: getLocation,
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

  if (isPending) {
    return (
      <div className="flex h-10 items-center gap-2.5">
        <Spinner className="h-4 w-4" />
        <p>Checking the weather...</p>
      </div>
    );
  }

  if (isError) {
    return <span>Unable to display weather information.</span>;
  }

  const weatherDescription = mapWeatherCode(
    String(weatherData.current.weather_code)
  );
  const today = new Date();

  return (
    <>
      <Link
        href="https://www.google.com/search?q=weather"
        className="flex items-center gap-6"
      >
        <p className="text-4xl font-bold">
          {weatherData.current.temperature_2m}
          {weatherData.current_units.temperature_2m}
        </p>
        {weatherDescription && (
          <div className="flex items-center gap-2">
            <div className="flex-col">
              <p className="font-medium">{locationData?.area}</p>
              <p className="text-xs opacity-70">
                {weatherDescription.description}
              </p>
            </div>
            <img className="w-10" src={weatherDescription.image} />
          </div>
        )}
      </Link>
      <div className="h-10 w-0.5 rounded bg-black/5" />
      <Link href="https://calendar.google.com" className="flex flex-col">
        <p className="font-medium">{formatToday(today)}</p>
        <p className="text-xs opacity-70">{formatWeekNumber(today)}</p>
      </Link>
    </>
  );
};

const Container = ({ className }: Props) => (
  <div className={cn("flex gap-4 items-center duration-500", className)}>
    <InfoWidget />
  </div>
);

export default Container;
