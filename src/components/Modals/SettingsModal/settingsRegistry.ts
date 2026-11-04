import {
  ClockIcon,
  CloudSunIcon,
  HouseIcon,
  ImagesIcon,
  PaletteIcon,
  SidebarSimpleIcon,
} from "@phosphor-icons/react";

import { defaultSettings } from "@/src/services/settings/defaultSettings";

import { Section } from "./settingsTypes";

export { settingEntries } from "./settingEntries";
export type {
  CustomEntry,
  Section,
  SegmentedEntry,
  SwatchesEntry,
  SettingEntry,
  SwitchEntry,
} from "./settingsTypes";

export const sections: Section[] = [
  {
    id: "sidebar",
    label: "Sidebar",
    icon: SidebarSimpleIcon,
    reset: (settings) => ({ ...settings, sidebar: defaultSettings.sidebar }),
  },
  {
    id: "homescreen",
    label: "Homescreen",
    icon: HouseIcon,
    reset: (settings) => ({
      ...settings,
      homescreen: defaultSettings.homescreen,
    }),
  },
  {
    id: "photos",
    label: "Photos",
    icon: ImagesIcon,
    reset: (settings) => ({
      ...settings,
      backgrounds: defaultSettings.backgrounds,
    }),
  },
  { id: "weather", label: "Weather & location", icon: CloudSunIcon },
  {
    id: "time",
    label: "Time & date",
    icon: ClockIcon,
    reset: (settings) => ({ ...settings, dateTime: defaultSettings.dateTime }),
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: PaletteIcon,
    reset: (settings) => ({
      ...settings,
      appearance: defaultSettings.appearance,
    }),
  },
];
