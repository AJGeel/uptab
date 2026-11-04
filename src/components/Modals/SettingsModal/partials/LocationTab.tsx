import { CrosshairIcon, MapPinIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import {
  MIN_RETRY_MS,
  useLocationAndWeather,
} from "@/src/hooks/queries/useLocationAndWeather";
import { useSettingHighlight } from "@/src/hooks/useSettingHighlight";
import { useSettings } from "@/src/hooks/useSettings";
import { getGeocodedLocation } from "@/src/services/location";
import {
  removeSavedLocation,
  setActiveLocation,
} from "@/src/services/location/savedLocations";

import AddLocation from "./AddLocation";
import GpsHelp from "./GpsHelp";
import LocationRow from "./LocationRow";

const LocationTab = () => {
  const highlightProps = useSettingHighlight("weather.location");
  const { data: settings, setLocationSettings } = useSettings();
  const { gpsFailure, retryLocation } = useLocationAndWeather();
  // Only reads the cached GPS lookup, which useLocationAndWeather fetches.
  const { data: gpsLocation } = useQuery({
    enabled: false,
    queryFn: getGeocodedLocation,
    queryKey: ["location", "gps"],
  });

  const [isRetrying, setIsRetrying] = useState(false);
  const [lastFailure, setLastFailure] = useState(gpsFailure);

  if (gpsFailure && gpsFailure !== lastFailure) {
    setLastFailure(gpsFailure);
  }

  if (!settings) {
    return null;
  }

  // A retry clears the failure while it runs, but the help should stay put.
  const failure = gpsFailure ?? (isRetrying ? lastFailure : undefined);

  const retry = async () => {
    setIsRetrying(true);
    await Promise.all([
      retryLocation(),
      new Promise((resolve) => setTimeout(resolve, MIN_RETRY_MS)),
    ]);
    setIsRetrying(false);
  };

  const { location } = settings;

  return (
    <div
      role="radiogroup"
      aria-label="Active location"
      className="rounded-xl border bg-white"
      {...highlightProps}
    >
      <div className="flex items-center gap-3 p-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-800">
          <MapPinIcon weight="duotone" className="size-5" />
        </span>
        <div className="flex flex-col">
          <h3 className="font-semibold">Location</h3>
          <p className="text-sm text-gray-700">
            Your weather follows the location you select here. Use your current
            location, or save places to switch between them.
          </p>
        </div>
      </div>

      <div className="border-t px-3">
        {failure ? (
          <div className="py-3">
            <GpsHelp
              failure={failure}
              isRetrying={isRetrying}
              onRetry={retry}
            />
          </div>
        ) : (
          <LocationRow
            label={
              gpsLocation?.area
                ? `${gpsLocation.area} (Current location)`
                : "Current location"
            }
            icon={<CrosshairIcon className="size-4 shrink-0" />}
            isActive={location.active === "gps"}
            onSelect={() =>
              setLocationSettings(setActiveLocation(location, "gps"))
            }
          />
        )}

        {location.saved.map(({ id, label }) => (
          <LocationRow
            key={id}
            label={label}
            isActive={location.active === id}
            onSelect={() =>
              setLocationSettings(setActiveLocation(location, id))
            }
            onDelete={() =>
              setLocationSettings(removeSavedLocation(location, id))
            }
          />
        ))}
      </div>

      <div className="rounded-b-xl border-t bg-black/2 px-3 pb-3">
        <AddLocation location={location} onChange={setLocationSettings} />
      </div>
    </div>
  );
};

export default LocationTab;
