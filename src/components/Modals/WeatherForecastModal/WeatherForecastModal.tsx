import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";

import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import { useLocationAndWeather } from "@/src/hooks/queries/useLocationAndWeather";
import { mapWeatherCode } from "@/src/services/weather";
import { cn } from "@/src/utils";

const cellStyle = cn("w-20 text-center py-1");

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
      className="max-w-4xl "
    >
      {isPending && <p className="text-sm text-gray-500">Loading weather...</p>}

      {isError && (
        <p className="text-sm text-red-500">Unable to load weather data.</p>
      )}

      {!isPending && !isError && forecast && (
        <div className="overflow-x-auto rounded-lg py-4 outline outline-1 outline-black/5">
          <div className="min-w-max">
            <div className="flex">
              {forecast.map((hour) => {
                const isNow =
                  new Date(hour.time).getTime() <= Date.now() &&
                  new Date(hour.time).getTime() + 60 * 60 * 1000 > Date.now();

                return (
                  <p key={hour.time} className={cn(cellStyle, "text-black/70")}>
                    {isNow
                      ? "Now"
                      : new Date(hour.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                  </p>
                );
              })}
            </div>

            <div className="flex">
              {forecast.map((hour) => (
                <p key={hour.time} className={cn(cellStyle, "font-semibold")}>
                  {Math.round(hour.temperature_2m)}°
                </p>
              ))}
            </div>

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

            <div className="flex">
              {forecast.map((hour) => (
                <p
                  key={hour.time}
                  className={cn(cellStyle, "text-sky-700 text-xs")}
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
