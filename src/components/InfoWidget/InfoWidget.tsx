import { CloudSunIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { PropsWithChildren, useState } from "react";

import {
  MIN_RETRY_MS,
  useLocationAndWeather,
} from "@/src/hooks/queries/useLocationAndWeather";
import { useModalStore } from "@/src/hooks/stores/useModalStore";
import { cn } from "@/src/utils";
import { delay } from "@/src/utils/delay";

import { pickLoadingMessage } from "./loadingMessages";
import CalendarWidget from "./partials/CalendarWidget";
import WeatherWidget from "./partials/WeatherWidget";
import { widgetHover, widgetPress } from "./partials/widgetHover";
import Button, { buttonVariants } from "../ui/Button";
import Loader from "../ui/Loader";

type Props = {
  className?: string;
  inert?: boolean;
  /** The setting that shows this widget, outlined when it's hovered in the preferences. */
  settingId?: string;
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

/** A new message each time it shows, as the wrapper around it is new each time. */
const LoadingMessage = () => {
  const [message] = useState(pickLoadingMessage);

  return <Loader label={message} className="h-10.5" />;
};

const InfoWidget = ({ className, inert, settingId }: Props) => {
  const {
    status: liveStatus,
    data: { weatherData, locationData },
    retryWeather,
  } = useLocationAndWeather();
  const [isRetrying, setIsRetrying] = useState(false);
  // A retry can be over in a blink, so it shows as loading for long enough to notice.
  const status = isRetrying ? "loading" : liveStatus;

  const retry = async () => {
    setIsRetrying(true);
    await Promise.all([retryWeather(), delay(MIN_RETRY_MS)]);
    setIsRetrying(false);
  };

  const openSettingsSection = useModalStore(
    (state) => state.openSettingsSection,
  );

  return (
    <div className={className} inert={inert} data-setting={settingId}>
      {/* As tall as the weather itself, so the other states don't shift what's below. */}
      <div className="flex min-h-11 items-center">
        <AnimatePresence mode="wait" initial={false}>
          {status === "locationError" && (
            <Wrapper key="location" className="flex items-center gap-4">
              <button
                className={cn(
                  "flex items-center gap-3 text-left",
                  widgetHover,
                  widgetPress,
                )}
                onClick={() => openSettingsSection("weather", "citySearch")}
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
              <LoadingMessage />
            </Wrapper>
          )}

          {status === "weatherError" && (
            <Wrapper key="error">
              <span>
                Couldn&apos;t fetch the weather. Want to{" "}
                <Button
                  label="try again"
                  variant={buttonVariants.inline}
                  onClick={retry}
                />
                ?
              </span>
            </Wrapper>
          )}

          {status === "ready" && weatherData && locationData && (
            <Wrapper key="weather" className="flex items-center gap-4">
              <WeatherWidget
                weatherData={weatherData}
                area={locationData.area}
              />

              <div className="h-10 w-0.5 rounded-sm bg-black/5" />

              <CalendarWidget />
            </Wrapper>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InfoWidget;
