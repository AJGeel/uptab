import { loadForecastChart } from "@/src/components/Modals/WeatherForecastModal/loadForecastChart";
import { useModalStore } from "@/src/hooks/stores/useModalStore";
import { Weather, mapWeatherCode } from "@/src/services/weather";
import { cn } from "@/src/utils";

import LocationSwitcher from "./LocationSwitcher";
import { widgetHover } from "./widgetHover";
import Tooltip from "../../ui/Tooltip";

interface WeatherWidgetProps {
  weatherData: Weather;
  area?: string;
}

const WeatherWidget = ({ weatherData, area }: WeatherWidgetProps) => {
  const setActiveModal = useModalStore((state) => state.setActiveModal);

  const weatherDescription = mapWeatherCode(
    weatherData.current.weather_code,
    weatherData.current.is_day === 1,
  );

  /*
   * The forecast button covers the whole widget, so that the location switcher,
   * which sits above it, isn't nested inside the button.
   */
  return (
    <div
      className={cn(
        "group relative flex items-center gap-6",
        widgetHover,
        "has-[[data-forecast]:active]:scale-95 has-[[data-forecast]:active]:opacity-70",
        // The location switcher has its own hover, so the widget's steps aside.
        "has-[[role=combobox]:hover]:bg-transparent! has-[[role=combobox]:hover]:backdrop-blur-none!",
      )}
    >
      <p className="text-4xl font-bold">
        {weatherData.current.temperature_2m}°C
      </p>

      <div className="flex items-center gap-2">
        <div className="flex-col">
          <div className="relative z-10">
            <LocationSwitcher area={area ?? "Unknown location"} />
          </div>

          <Tooltip label="See the weather forecast" side="bottom">
            <button
              data-forecast
              className="rounded-xs text-left text-xs opacity-70 ring-sky-500 after:absolute after:inset-0 after:rounded-lg focus-visible:outline-hidden focus-visible:after:ring-2"
              onClick={() => setActiveModal("weatherForecast")}
              onFocus={loadForecastChart}
              onPointerEnter={loadForecastChart}
            >
              {weatherDescription?.description ?? "Forecast"}
            </button>
          </Tooltip>
        </div>

        {weatherDescription && (
          <img
            className="w-10"
            src={weatherDescription.image}
            alt={weatherDescription.description}
          />
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;
