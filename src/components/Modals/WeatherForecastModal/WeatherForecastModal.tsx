import { useLocationAndWeather } from "@/src/hooks/queries/useLocationAndWeather";
import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";

import ForecastChart from "./ForecastChart";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";

const WeatherForecastModal = () => {
  const activeModal = useModalStore((state) => state.activeModal);
  const setActiveModal = useModalStore((state) => state.setActiveModal);
  const closeModal = () => setActiveModal(null);

  const {
    data: { weatherData, locationData },
    isPending: { isLocationPending, isWeatherPending },
    isError: { isLocationError, isWeatherError },
  } = useLocationAndWeather();

  const isPending = isLocationPending || isWeatherPending;
  const isError = isLocationError || isWeatherError;

  return (
    <Modal
      isVisible={activeModal === Modals.weather_forecast}
      onClose={closeModal}
      title="Weather Forecast"
      subtitle={
        locationData?.area
          ? `Here's what to expect in ${locationData.area}.`
          : undefined
      }
      className="max-w-4xl"
    >
      {isError && (
        <p className="text-sm text-red-500">Unable to load weather data.</p>
      )}

      {!isError && isPending && (
        <p className="text-sm text-gray-500">Loading weather...</p>
      )}

      {!isError && !isPending && weatherData && (
        <ForecastChart hourly={weatherData.hourly} />
      )}

      <div className="mt-8 flex justify-end">
        <Button label="Got it, thanks." onClick={closeModal} />
      </div>
    </Modal>
  );
};

export default WeatherForecastModal;
