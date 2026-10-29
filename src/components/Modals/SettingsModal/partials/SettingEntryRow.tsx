import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import { hotkeyDescriptions } from "@/src/services/hotkeys/hotkeys";
import { Settings } from "@/src/services/settings/types";

import LocationTab from "./LocationTab";
import SettingRow from "./SettingRow";
import Button, { buttonVariants } from "../../../ui/Button";
import SegmentedControl from "../../../ui/SegmentedControl";
import SwatchesControl from "../../../ui/SwatchesControl";
import { SettingEntry } from "../settingsRegistry";

type Props = {
  entry: SettingEntry;
  settings: Settings;
  query: string;
  onChange: (settings: Settings) => void;
};

const hotkeyOf = (entry: SettingEntry) =>
  entry.hotkey && hotkeyDescriptions[entry.hotkey].keyDisplay;

/** One setting, with the control that fits it. */
const SettingEntryRow = ({ entry, settings, query, onChange }: Props) => {
  const openModal = useModalStore((state) => state.openModal);

  if (entry.kind === "switch") {
    return (
      <SettingRow
        settingId={entry.id}
        icon={entry.icon}
        title={entry.title}
        description={entry.description}
        query={query}
        hotkey={hotkeyOf(entry)}
        isActive={entry.get(settings)}
        onToggle={() => onChange(entry.set(settings, !entry.get(settings)))}
      />
    );
  }

  if (entry.kind === "segmented") {
    return (
      <SettingRow
        settingId={entry.id}
        icon={entry.icon}
        title={entry.title}
        description={entry.description}
        query={query}
      >
        <SegmentedControl
          ariaLabel={entry.title}
          value={entry.get(settings)}
          options={entry.options}
          onValueChange={(value) => onChange(entry.set(settings, value))}
        />
      </SettingRow>
    );
  }

  if (entry.kind === "swatches") {
    return (
      <SettingRow
        settingId={entry.id}
        icon={entry.icon}
        title={entry.title}
        description={entry.description}
        query={query}
      >
        <SwatchesControl
          ariaLabel={entry.title}
          value={entry.get(settings)}
          swatches={entry.options}
          onValueChange={(value) => onChange(entry.set(settings, value))}
        />
      </SettingRow>
    );
  }

  if (entry.content === "location") {
    return <LocationTab />;
  }

  const isBackgrounds = entry.content === "backgrounds";
  const backgroundCount = settings.backgrounds.themes.length;

  return (
    <SettingRow
      settingId={entry.id}
      key={entry.id}
      icon={entry.icon}
      title={entry.title}
      description={
        isBackgrounds
          ? `${entry.description} Now showing ${backgroundCount === 0 ? "all of them" : `${backgroundCount} of them`}.`
          : entry.description
      }
      query={query}
      hotkey={hotkeyOf(entry)}
    >
      <Button
        label={isBackgrounds ? "Choose backgrounds" : "Open my photos"}
        variant={buttonVariants.secondary}
        className="shrink-0 border bg-white"
        onClick={() =>
          openModal(isBackgrounds ? Modals.backgrounds : Modals.localPhotos)
        }
      />
    </SettingRow>
  );
};

export default SettingEntryRow;
