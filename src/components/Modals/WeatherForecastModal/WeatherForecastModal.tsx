import { lazy, ReactNode, Suspense } from "react";

import { useLocationAndWeather } from "@/src/hooks/queries/useLocationAndWeather";
import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";

import DailySummaries from "./DailySummaries";
import { DailySummary } from "./forecastChartData";
import { loadForecastChart } from "./loadForecastChart";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import Spinner from "../../ui/Spinner";

const ForecastChart = lazy(loadForecastChart);

const PLACEHOLDER_SUMMARIES: DailySummary[] = ["1", "2", "3"].map((dayKey) => ({
  dayKey,
  // A non-breaking space keeps the line's height, like a real day name.
  dayLabel: "\u00a0",
  high: 0,
  low: 0,
  precipitation: 0,
  weather: undefined,
}));

/**
 * Mirrors ForecastChart's layout (an invisible summary row, then the chart's
 * height), so the modal keeps its size when the chart loads.
 */
const Placeholder = ({ children }: { children: ReactNode }) => (
  <div className="mt-2 space-y-6">
    <div className="invisible" aria-hidden>
      <DailySummaries summaries={PLACEHOLDER_SUMMARIES} />
    </div>
    <div className="flex h-70 items-center justify-center">{children}</div>
  </div>
);

const WeatherForecastModal = () => {
  const activeModal = useModalStore((state) => state.activeModal);
  const setActiveModal = useModalStore((state) => state.setActiveModal);
  const closeModal = () => setActiveModal(null);

  const {
    status,
    data: { weatherData, locationData },
  } = useLocationAndWeather();

  const isPending = status === "loading";
  const isError = status === "locationError" || status === "weatherError";

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
      footer={
        <div className="flex justify-end">
          <Button label="Got it, thanks." onClick={closeModal} />
        </div>
      }
    >
      {isError && (
        <Placeholder>
          <p className="text-sm text-red-500">Unable to load weather data.</p>
        </Placeholder>
      )}

      {!isError && isPending && (
        <Placeholder>
          <Spinner className="size-8" />
        </Placeholder>
      )}

      {!isError && !isPending && weatherData && (
        <Suspense
          fallback={
            <Placeholder>
              <Spinner className="size-8" />
            </Placeholder>
          }
        >
          <ForecastChart hourly={weatherData.hourly} />
        </Suspense>
      )}
    </Modal>
  );
};

export default WeatherForecastModal;
