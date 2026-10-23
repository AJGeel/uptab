import { CrosshairIcon } from "@phosphor-icons/react";

import { useModalStore } from "@/src/hooks/stores/useModalStore";
import { useSettings } from "@/src/hooks/useSettings";
import { getShortAreaName } from "@/src/services/location/locationMessages";
import { setActiveLocation } from "@/src/services/location/savedLocations";
import { cn } from "@/src/utils";

import { widgetTint } from "./widgetHover";
import Select from "../../ui/Select";

type Props = {
  /** The name of the location being shown. */
  area: string;
};

/** Quick-switches between the current location and the saved ones. */
const LocationSwitcher = ({ area }: Props) => {
  const { data: settings, setLocationSettings } = useSettings();
  const openSettingsTab = useModalStore((state) => state.openSettingsTab);

  if (!settings) {
    return <p className="font-medium">{getShortAreaName(area)}</p>;
  }

  const { location } = settings;

  return (
    <Select
      ariaLabel="Location"
      tooltip="Change your (weather forecast) location"
      // Keeps the name in line with the text below, despite the hover padding.
      className={cn("-ml-2", widgetTint)}
      value={location.active}
      options={[
        {
          value: "gps",
          label: "Current location",
          icon: <CrosshairIcon className="size-4 shrink-0" />,
        },
        ...location.saved.map(({ id, label }) => ({ value: id, label })),
      ]}
      triggerLabel={getShortAreaName(area)}
      action={{
        label: "Manage locations",
        onClick: () => openSettingsTab("Location"),
      }}
      onValueChange={(value) =>
        setLocationSettings(setActiveLocation(location, value))
      }
    />
  );
};

export default LocationSwitcher;
