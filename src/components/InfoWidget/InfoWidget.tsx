import { useQuery } from "@tanstack/react-query";

import { getGeocodedLocation } from "@/src/services/location";
import { getWeather } from "@/src/services/weather";
import { cn } from "@/src/utils";

import CalendarWidget from "./partials/CalendarWidget";
import Loader from "../ui/Loader";
import WeatherWidget from "./partials/WeatherWidget";

import { AnimatePresence, motion } from "motion/react";
import { PropsWithChildren } from "react";

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
  const { isError: isLocationError, data: locationData } = useQuery({
    queryFn: getGeocodedLocation,
    queryKey: ["location"],
  });

  const {
    isPending,
    isError,
    data: weatherData,
  } = useQuery({
    enabled: !!locationData,
    queryFn: () =>
      getWeather({
        latitude: locationData?.latitude,
        longitude: locationData?.longitude,
      }),
    queryKey: ["weather", locationData?.latitude, locationData?.longitude],
  });

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

        {isError && (
          <Wrapper key="error">
            <span>Unable to display weather information.</span>
          </Wrapper>
        )}

        {!isLocationError && !isPending && !isError && (
          <Wrapper key="weather" className="flex items-center gap-4">
            <WeatherWidget
              weatherData={weatherData}
              area={locationData?.area}
            />
            <div className="h-10 w-0.5 rounded bg-black/5" />
            <CalendarWidget />
          </Wrapper>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InfoWidget;
