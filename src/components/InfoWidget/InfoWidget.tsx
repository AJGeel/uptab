import { AnimatePresence, motion } from "motion/react";
import { PropsWithChildren } from "react";

import { useLocationAndWeather } from "@/src/hooks/queries/useLocationAndWeather";
import { cn } from "@/src/utils";

import CalendarWidget from "./partials/CalendarWidget";
import WeatherWidget from "./partials/WeatherWidget";
import Loader from "../ui/Loader";

type Props = {
  className?: string;
};

const Wrapper = ({ children, className }: PropsWithChildren<Props>) => (
  <motion.div
    initial={{ opacity: 0, x: -4 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -4 }}
    transition={{
      duration: 0.3,
      ease: "easeInOut",
    }}
    className={cn(className)}
  >
    {children}
  </motion.div>
);

const InfoWidget = ({ className }: Props) => {
  const {
    data: { weatherData, locationData },
    isPending: { isLocationPending, isWeatherPending },
    isError: { isLocationError, isWeatherError },
  } = useLocationAndWeather();

  const isPending = isLocationPending || isWeatherPending;
  const isError = isLocationError || isWeatherError;

  return (
    <div className={className}>
      <AnimatePresence mode="wait" initial={false}>
        {isLocationError && (
          <Wrapper key="location">
            <CalendarWidget />
          </Wrapper>
        )}

        {isPending && (
          <Wrapper key="loading">
            <Loader label="Checking the weather..." className="h-10" />
          </Wrapper>
        )}

        {isError && !isLocationError && (
          <Wrapper key="error">
            <span>Unable to display weather information.</span>
          </Wrapper>
        )}

        {!isPending && !isError && weatherData && (
          <Wrapper key="weather" className="flex items-center gap-4">
            <WeatherWidget
              weatherData={weatherData}
              area={locationData?.area}
            />

            <div className="h-10 w-0.5 rounded bg-black/5" />

            <CalendarWidget />
          </Wrapper>
        )}

        {!isPending && !isError && !weatherData && (
          <Wrapper key="calendar">
            <CalendarWidget />
          </Wrapper>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InfoWidget;
