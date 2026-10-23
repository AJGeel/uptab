import { CloudSunIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { PropsWithChildren } from "react";

import { useLocationAndWeather } from "@/src/hooks/queries/useLocationAndWeather";
import { useModalStore } from "@/src/hooks/stores/useModalStore";
import { cn } from "@/src/utils";

import CalendarWidget from "./partials/CalendarWidget";
import WeatherWidget from "./partials/WeatherWidget";
import { widgetHover, widgetPress } from "./partials/widgetHover";
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
    status,
    data: { weatherData, locationData },
  } = useLocationAndWeather();

  const openSettingsTab = useModalStore((state) => state.openSettingsTab);

  return (
    <div className={className}>
      <AnimatePresence mode="wait" initial={false}>
        {status === "locationError" && (
          <Wrapper key="location" className="flex items-center gap-4">
            <button
              className={cn(
                "flex items-center gap-3 text-left",
                widgetHover,
                widgetPress,
              )}
              onClick={() => openSettingsTab("Location")}
            >
              <CloudSunIcon className="size-8" />

              <span className="flex flex-col">
                <span className="font-medium">Add a location</span>
                <span className="text-xs opacity-70">for weather info</span>
              </span>
            </button>

            <div className="h-10 w-0.5 rounded-sm bg-black/5" />

            <CalendarWidget />
          </Wrapper>
        )}

        {status === "loading" && (
          <Wrapper key="loading">
            <Loader label="Checking the weather..." className="h-10" />
          </Wrapper>
        )}

        {status === "weatherError" && (
          <Wrapper key="error">
            <span>Unable to display weather information.</span>
          </Wrapper>
        )}

        {status === "ready" && weatherData && locationData && (
          <Wrapper key="weather" className="flex items-center gap-4">
            <WeatherWidget weatherData={weatherData} area={locationData.area} />

            <div className="h-10 w-0.5 rounded-sm bg-black/5" />

            <CalendarWidget />
          </Wrapper>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InfoWidget;
