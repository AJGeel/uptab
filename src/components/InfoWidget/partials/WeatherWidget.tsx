import { loadForecastChart } from "@/src/components/Modals/WeatherForecastModal/loadForecastChart";
import { useModalStore } from "@/src/hooks/stores/useModalStore";
import { useSettings } from "@/src/hooks/useSettings";
import { Weather, mapWeatherCode } from "@/src/services/weather";
import {
  temperatureSymbol,
  toDisplayTemperature,
} from "@/src/services/weather/temperature";
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
  const unit = useSettings().data?.units.temperature ?? "celsius";

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
      <p data-setting="weather.temperature" className="text-4xl font-bold">
        {toDisplayTemperature(weatherData.current.temperature_2m, unit)}
        {/* °C is wider than °F: both are as wide as the widest, so nothing next to it shifts. */}
        <span className="inline-grid">
          <span className="col-start-1 row-start-1">
            {temperatureSymbol(unit)}
          </span>
          <span aria-hidden className="invisible col-start-1 row-start-1">
            °C
          </span>
        </span>
      </p>

      <div className="flex items-center gap-2">
        <div className="flex-col">
          <div
            data-setting="weather.location"
            className="relative z-10 -mb-0.5"
          >
            <LocationSwitcher area={area ?? "Unknown location"} />
          </div>

          <Tooltip label="See the weather forecast" side="bottom">
            <button
              data-forecast
              className="rounded-xs text-left text-xs opacity-70 after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-hidden focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-sky-500"
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
            className="size-10"
            src={weatherDescription.image}
            alt={weatherDescription.description}
          />
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;
