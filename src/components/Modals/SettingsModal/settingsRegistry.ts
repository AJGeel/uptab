import {
  CalendarDotsIcon,
  CloudSunIcon,
  HouseIcon,
  ImagesIcon,
  MapPinIcon,
  PaletteIcon,
  SidebarSimpleIcon,
} from "@phosphor-icons/react";

import UpTabIcon from "@/src/components/ui/UpTabIcon";
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
    reset: (settings) => ({
      ...settings,
      // The weather & date widget is switched in its own section.
      sidebar: {
        ...defaultSettings.sidebar,
        showInfoWidget: settings.sidebar.showInfoWidget,
      },
    }),
  },
  {
    id: "homescreen",
    label: "Homescreen",
    icon: HouseIcon,
    reset: (settings) => ({
      ...settings,
      homescreen: {
        ...defaultSettings.homescreen,
        showInfoWidget: settings.homescreen.showInfoWidget,
      },
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
  { id: "location", label: "Location", icon: MapPinIcon },
  {
    id: "weather",
    label: "Weather & date",
    icon: CloudSunIcon,
    reset: (settings) => ({
      ...settings,
      units: defaultSettings.units,
      forecast: defaultSettings.forecast,
      sidebar: {
        ...settings.sidebar,
        showInfoWidget: defaultSettings.sidebar.showInfoWidget,
      },
      homescreen: {
        ...settings.homescreen,
        showInfoWidget: defaultSettings.homescreen.showInfoWidget,
      },
      dateTime: {
        ...settings.dateTime,
        timeFormat: defaultSettings.dateTime.timeFormat,
        forecastDays: defaultSettings.dateTime.forecastDays,
      },
    }),
  },
  { id: "calendar", label: "Calendar", icon: CalendarDotsIcon },
  {
    id: "appearance",
    label: "Look & feel",
    icon: PaletteIcon,
    reset: (settings) => ({
      ...settings,
      appearance: defaultSettings.appearance,
      sidebar: {
        ...settings.sidebar,
        showUpdates: defaultSettings.sidebar.showUpdates,
        feedbackFrequency: defaultSettings.sidebar.feedbackFrequency,
        showFeedbackPrompt: defaultSettings.sidebar.showFeedbackPrompt,
      },
    }),
  },
  { id: "general", label: "About UpTab", icon: UpTabIcon },
];
