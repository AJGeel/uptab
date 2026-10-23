import { CrosshairIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";

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

const LocationTab = () => {
  const { data: settings, setLocationSettings } = useSettings();
  const { gpsFailure, retryLocation } = useLocationAndWeather();
  // Only reads the cached GPS lookup, which useLocationAndWeather fetches.
  const { data: gpsLocation } = useQuery({
    enabled: false,
    queryFn: getGeocodedLocation,
    queryKey: ["location", "gps"],
  });

  if (!settings) {
    return null;
  }

  const { location } = settings;

  return (
    <div role="radiogroup" aria-label="Active location">
      <p className="my-4 text-sm text-gray-700">
        Your weather follows the location you select here. Use your current
        location, or save places to switch between them.
      </p>

      <div>
        <LocationRow
          label={
            gpsLocation?.area
              ? `${gpsLocation.area} (Current location)`
              : "Current location"
          }
          icon={<CrosshairIcon className="size-4 shrink-0" />}
          details={
            gpsFailure && (
              <GpsHelp failure={gpsFailure} onRetry={() => retryLocation()} />
            )
          }
          isActive={location.active === "gps"}
          onSelect={() =>
            setLocationSettings(setActiveLocation(location, "gps"))
          }
        />

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
