import { CaretDownIcon } from "@phosphor-icons/react";
import { lazy, ReactNode, Suspense, useState } from "react";

import { useLocationAndWeather } from "@/src/hooks/queries/useLocationAndWeather";
import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import { useSettings } from "@/src/hooks/useSettings";
import { DEFAULT_FORECAST_DAYS } from "@/src/services/weather/constants";
import { cn } from "@/src/utils";

import DailySummaries from "./DailySummaries";
import { DailySummary } from "./forecastChartData";
import { loadForecastChart } from "./loadForecastChart";
import AnimatedHeight from "../../ui/AnimatedHeight";
import Button, { inlineLinkStyles } from "../../ui/Button";
import Modal from "../../ui/Modal";
import Spinner from "../../ui/Spinner";
import QuickSettings from "../SettingsModal/partials/QuickSettings";

const ForecastChart = lazy(loadForecastChart);

/** The preferences that shape the forecast, in the order they read best. */
const FORECAST_SETTING_IDS = [
  "weather.temperature",
  "weather.wind",
  "time.timeFormat",
  "time.forecastDays",
];

const placeholderSummaries = (days: number): DailySummary[] =>
  Array.from({ length: days }, (_, index) => ({
    dayKey: String(index),
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
const Placeholder = ({
  days,
  children,
}: {
  days: number;
  children: ReactNode;
}) => (
  <div className="mt-2 space-y-6">
    <div className="invisible" aria-hidden>
      <DailySummaries summaries={placeholderSummaries(days)} />
    </div>
    <div className="flex h-70 items-center justify-center">{children}</div>
  </div>
);

const WeatherForecastModal = () => {
  const activeModal = useModalStore((state) => state.activeModal);
  const setActiveModal = useModalStore((state) => state.setActiveModal);
  const openSettingsSection = useModalStore(
    (state) => state.openSettingsSection,
  );
  const closeModal = () => setActiveModal(null);
  const { data: settings } = useSettings();
  const days = settings?.dateTime.forecastDays ?? DEFAULT_FORECAST_DAYS;
  const [isTweaking, setIsTweaking] = useState(false);

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
        <div>
          <AnimatedHeight>
            {isTweaking && (
              <QuickSettings
                ids={FORECAST_SETTING_IDS}
                onOpenAll={() => openSettingsSection("time")}
              />
            )}
          </AnimatedHeight>

          <div className="flex items-center justify-between gap-2">
            <button
              aria-expanded={isTweaking}
              className={cn(inlineLinkStyles, "flex items-center gap-1")}
              onClick={() => setIsTweaking((current) => !current)}
            >
              Tweak this forecast
              <CaretDownIcon
                weight="bold"
                className={cn(
                  "size-3.5 duration-200",
                  isTweaking && "rotate-180",
                )}
              />
            </button>
            <Button label="Looking good!" onClick={closeModal} />
          </div>
        </div>
      }
    >
      {isError && (
        <Placeholder days={days}>
          <p className="text-sm text-red-500">
            Couldn&apos;t fetch the weather. Check your connection?
          </p>
        </Placeholder>
      )}

      {!isError && isPending && (
        <Placeholder days={days}>
          <Spinner className="size-8" />
        </Placeholder>
      )}

      {!isError && !isPending && weatherData && (
        <Suspense
          fallback={
            <Placeholder days={days}>
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
