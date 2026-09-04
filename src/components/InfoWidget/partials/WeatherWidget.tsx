import Link from "@/src/components/ui/Link";
import { Weather, mapWeatherCode } from "@/src/services/weather";

interface WeatherWidgetProps {
  weatherData: Weather;
  area?: string;
}

const WeatherWidget = ({ weatherData, area }: WeatherWidgetProps) => {
  const weatherDescription = mapWeatherCode(
    String(weatherData.current.weather_code),
  );

  return (
    <Link
      href="https://www.google.com/search?q=weather"
      className="flex items-center gap-6"
    >
      <p className="text-4xl font-bold">
        {weatherData.current.temperature_2m}°C
      </p>

      {weatherDescription && (
        <div className="flex items-center gap-2">
          <div className="flex-col">
            <p className="font-medium">{area ?? "Unknown location"}</p>

            <p className="text-xs opacity-70">
              {weatherDescription.description}
            </p>
          </div>

          <img
            className="w-10"
            src={weatherDescription.image}
            alt={weatherDescription.description}
          />
        </div>
      )}
    </Link>
  );
};

export default WeatherWidget;
