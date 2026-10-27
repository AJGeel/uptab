import { CrosshairIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { useLocationAndWeather } from "@/src/hooks/queries/useLocationAndWeather";
import { useSettings } from "@/src/hooks/useSettings";
import { getGeocodedLocation } from "@/src/services/location";
import {
  removeSavedLocation,
  setActiveLocation,
} from "@/src/services/location/savedLocations";

import AddLocation from "./AddLocation";
import GpsHelp from "./GpsHelp";
import LocationRow from "./LocationRow";

/** Long enough to notice that something happened, as a retry can be instant. */
const MIN_RETRY_MS = 800;

const LocationTab = () => {
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
    <div role="radiogroup" aria-label="Active location">
      <p className="my-4 text-sm text-gray-700">
        Your weather follows the location you select here. Use your current
        location, or save places to switch between them.
      </p>

      <div>
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

      <AddLocation location={location} onChange={setLocationSettings} />
    </div>
  );
};

export default LocationTab;
