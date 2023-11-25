import { getWeather } from "@src/services/weather/getWeather";
import { mapWeatherCode } from "@src/services/weather/mapWeatherCode";
import cn from "@src/utils/cn";
import { formatToday } from "@src/utils/formatToday";
import { formatWeekNumber } from "@src/utils/formatWeekNumber";
import { useQuery } from "@tanstack/react-query";

type Props = {
  className?: string;
};

const InfoWidget = () => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["weather"],
    queryFn: getWeather,
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const weatherDescription = mapWeatherCode(String(data.current.weather_code));
  const today = new Date();

  return (
    <>
      <div className="flex items-center gap-6">
        <p className="text-4xl font-bold">
          {data.current.temperature_2m}
          {data.current_units.temperature_2m}
        </p>
        {weatherDescription && (
          <div className="flex items-center gap-2">
            <div className="flex-col">
              <p className="font-medium">Somewhere</p>
              <p className="text-xs opacity-70">
                {weatherDescription.description}
              </p>
            </div>
            <img className="w-10" src={weatherDescription.image} />
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <p className="font-medium">{formatToday(today)}</p>
        <p className="text-xs opacity-70">{formatWeekNumber(today)}</p>
      </div>
    </>
  );
};

const Container = ({ className }: Props) => (
  <div className={cn("flex gap-4 items-center duration-300", className)}>
    <InfoWidget />
  </div>
);

export default Container;
