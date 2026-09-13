import { useLocationAndWeather } from "@/src/hooks/queries/useLocationAndWeather";
import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import { mapWeatherCode, Weather } from "@/src/services/weather";
import { cn } from "@/src/utils";

import Button from "../../ui/Button";
import Modal from "../../ui/Modal";

const cellStyle = cn("w-20 shrink-0 text-center py-1");

const getDayLabel = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) {
    return "Today";
  }
  if (diffDays === 1) {
    return "Tomorrow";
  }
  return "In two days";
};

const isNewDay = (forecast: Weather["hourly"], index: number) => {
  if (index === 0) {
    return true;
  }

  const current = new Date(forecast[index].time);
  const previous = new Date(forecast[index - 1].time);

  return current.toDateString() !== previous.toDateString();
};

const WeatherForecastModal = () => {
  const activeModal = useModalStore((state) => state.activeModal);
  const setActiveModal = useModalStore((state) => state.setActiveModal);

  const {
    data: { weatherData, locationData },
    isPending: { isLocationPending, isWeatherPending },
    isError: { isLocationError, isWeatherError },
  } = useLocationAndWeather();

  const isPending = isLocationPending || isWeatherPending;
  const isError = isLocationError || isWeatherError;

  const forecast = weatherData?.hourly.filter((hour) => {
    const now = new Date();

    const currentHour = new Date(now);
    currentHour.setMinutes(0, 0, 0);

    const dayAfterTomorrow = new Date(currentHour);
    dayAfterTomorrow.setDate(currentHour.getDate() + 2);
    dayAfterTomorrow.setHours(23, 0, 0, 0);

    const hourTime = new Date(hour.time);

    return hourTime >= currentHour && hourTime <= dayAfterTomorrow;
  });

  return (
    <Modal
      isVisible={activeModal === Modals.weather_forecast}
      onClose={() => setActiveModal(null)}
      title="Weather Forecast"
      subtitle={
        locationData?.area
          ? `Here's what to expect in ${locationData.area}.`
          : undefined
      }
      className="max-w-4xl"
    >
      {isPending && <p className="text-sm text-gray-500">Loading weather...</p>}

      {isError && (
        <p className="text-sm text-red-500">Unable to load weather data.</p>
      )}

      {!isPending && !isError && forecast && (
        <div className="overflow-x-auto rounded-lg py-4 outline outline-1 outline-black/5">
          <div className="min-w-max">
            {/* Time */}
            <div className="flex">
              {forecast.map((hour, index) => {
                const date = new Date(hour.time);
                const newDay = isNewDay(forecast, index);

                return (
                  <div key={hour.time} className="w-20 shrink-0">
                    <div className="sticky left-0 z-10 w-20 pb-4 text-center font-medium text-black/50">
                      {newDay ? getDayLabel(date) : "\u00A0"}
                    </div>

                    <p className={cn(cellStyle, "text-black/70")}>
                      {new Date(hour.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Temperature */}
            <div className="flex">
              {forecast.map((hour) => (
                <p key={hour.time} className={cn(cellStyle, "font-semibold")}>
                  {Math.round(hour.temperature_2m)}°
                </p>
              ))}
            </div>

            {/* Weather icon */}
            <div className="flex">
              {forecast.map((hour) => {
                const code = mapWeatherCode(hour.weather_code);

                return (
                  <div
                    key={hour.time}
                    className={cn(
                      cellStyle,
                      "flex items-center justify-center",
                    )}
                  >
                    {code && (
                      <img
                        className="size-12 [filter:drop-shadow(0.5px_0_0_#020E2C33)_drop-shadow(-0.5px_0_0_#020E2C33)_drop-shadow(0_0.5px_0_#020E2C33)_drop-shadow(0_-0.5px_0_#020E2C33)]"
                        src={code.image}
                        alt={code.description}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Rain */}
            <div className="flex">
              {forecast.map((hour) => (
                <p
                  key={hour.time}
                  className={cn(cellStyle, "text-xs text-sky-700")}
                >
                  {hour.rain.toFixed(1)} mm
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <Button label="Got it, thanks." onClick={() => setActiveModal(null)} />
      </div>
    </Modal>
  );
};

export default WeatherForecastModal;
