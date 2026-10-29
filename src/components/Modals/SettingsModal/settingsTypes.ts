import { Icon } from "@phosphor-icons/react";

import { SettingsSection } from "@/src/hooks/stores/useModalStore";
import { Hotkeys } from "@/src/services/hotkeys/types";
import { Settings } from "@/src/services/settings/types";

export type Section = {
  id: SettingsSection;
  label: string;
  icon: Icon;
  /** Back to this section's defaults. Left out when that would throw away the user's own data. */
  reset?: (settings: Settings) => Settings;
};

type Base = {
  id: string;
  section: SettingsSection;
  title: string;
  description: string;
  /** Other words people may search for. */
  keywords: string[];
  icon: Icon;
  /** A key that does the same from anywhere, shown next to the title. */
  hotkey?: Hotkeys;
};

/** How an entry reads its value from the settings, and writes a new one. */
export type Control<T> = {
  get: (settings: Settings) => T;
  set: (settings: Settings, value: T) => Settings;
};

export type SwitchEntry = Base & { kind: "switch" } & Control<boolean>;

export type SegmentedEntry = Base & {
  kind: "segmented";
  options: { value: string; label: string }[];
} & Control<string>;

export type SwatchesEntry = Base & {
  kind: "swatches";
  options: { value: string; label: string; color: string }[];
} & Control<string>;

/** Has its own contents, which the modal knows how to render. */
export type CustomEntry = Base & {
  kind: "custom";
  content: "backgrounds" | "localPhotos" | "location";
};

export type SettingEntry =
  SwitchEntry | SegmentedEntry | SwatchesEntry | CustomEntry;

type Group =
  | "sidebar"
  | "homescreen"
  | "units"
  | "dateTime"
  | "forecast"
  | "appearance"
  | "backgrounds";

/** One value inside one of the settings groups. */
export const field = <G extends Group, K extends keyof Settings[G]>(
  group: G,
  key: K,
): Control<Settings[G][K]> => ({
  get: (settings) => settings[group][key],
  set: (settings, value) => ({
    ...settings,
    [group]: { ...settings[group], [key]: value },
  }),
});

/** For choices that are strings in the control, whatever they are in the settings. */
export const asString = <T>(
  control: Control<T>,
  parse: (value: string) => T,
): Control<string> => ({
  get: (settings) => String(control.get(settings)),
  set: (settings, value) => control.set(settings, parse(value)),
});
