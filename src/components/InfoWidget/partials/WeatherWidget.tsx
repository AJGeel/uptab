import Link from "@/src/components/ui/Link";
import { useModalStore } from "@/src/hooks/stores/useModalStore";
import { Weather, mapWeatherCode } from "@/src/services/weather";

interface WeatherWidgetProps {
  weatherData: Weather;
  area?: string;
}

const WeatherWidget = ({ weatherData, area }: WeatherWidgetProps) => {
  const setActiveModal = useModalStore((state) => state.setActiveModal);

  const weatherDescription = mapWeatherCode(weatherData.current.weather_code);

  return (
    <button
      className="flex items-center gap-6 hover:text-sky-800 active:scale-90 active:opacity-60 duration-150"
      onClick={() => setActiveModal("weatherForecast")}
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
    </button>
  );
};

export default WeatherWidget;
