import {
  BellRingingIcon,
  CalendarCheckIcon,
  CircleHalfIcon,
  ConfettiIcon,
  ClockIcon,
  CloudSunIcon,
  HouseIcon,
  InfoIcon,
  MegaphoneIcon,
  PaletteIcon,
  SidebarSimpleIcon,
  BugBeetleIcon,
  ThermometerIcon,
  ThermometerSimpleIcon,
  WindIcon,
  EggIcon,
} from "@phosphor-icons/react";

import {
  requestErrorReporting,
  revokeErrorReporting,
} from "@/src/services/errorReporting/consent";
import { ACCENTS } from "@/src/services/settings/accents";
import { THEMES } from "@/src/services/settings/theme";
import { AccentId, ThemeId } from "@/src/services/settings/types";
import { MAX_EXTRA_FORECAST_DAYS } from "@/src/services/weather/constants";

import { asString, field, SettingEntry } from "./settingsTypes";

export const generalEntries: SettingEntry[] = [
  {
    kind: "custom",
    id: "weather.location",
    section: "location",
    content: "location",
    title: "Location",
    description: "Your weather follows the location you select here.",
    keywords: ["gps", "city", "place", "forecast", "saved", "current"],
    icon: CloudSunIcon,
  },
  {
    kind: "switch",
    id: "homescreen.showInfoWidget",
    section: "weather",
    ...field("homescreen", "showInfoWidget"),
    title: "Show on homescreen",
    description: "Weather and the date, floating over your photo.",
    keywords: ["forecast", "calendar", "widget", "hide", "weather", "date"],
    icon: HouseIcon,
  },
  {
    kind: "switch",
    id: "sidebar.showInfoWidget",
    section: "weather",
    ...field("sidebar", "showInfoWidget"),
    title: "Show in sidebar",
    description: "A peek outside, right in your sidebar.",
    keywords: ["forecast", "calendar", "widget", "hide", "weather", "date"],
    icon: SidebarSimpleIcon,
  },
  {
    kind: "segmented",
    id: "weather.temperature",
    section: "weather",
    ...asString(field("units", "temperature"), (value) =>
      value === "fahrenheit" ? "fahrenheit" : "celsius",
    ),
    title: "Temperature",
    description: "Celsius or Fahrenheit, whichever you think in.",
    keywords: ["units", "degrees", "celsius", "fahrenheit", "weather"],
    icon: ThermometerIcon,
    options: [
      { value: "celsius", label: "°C" },
      { value: "fahrenheit", label: "°F" },
    ],
  },
  {
    kind: "switch",
    id: "weather.showFeelsLike",
    section: "weather",
    ...field("forecast", "showFeelsLike"),
    title: "Feels like",
    description: "Adds what it feels like to the forecast's hover card.",
    keywords: ["apparent", "temperature", "forecast", "tooltip", "chill"],
    icon: ThermometerSimpleIcon,
  },
  {
    kind: "segmented",
    id: "weather.wind",
    section: "weather",
    ...asString(field("units", "wind"), (value) =>
      value === "mph" ? "mph" : "kmh",
    ),
    title: "Wind speed",
    description: "Shown in the forecast, in km/h or mph.",
    keywords: ["units", "kmh", "km/h", "mph", "breeze", "forecast"],
    icon: WindIcon,
    options: [
      { value: "kmh", label: "km/h" },
      { value: "mph", label: "mph" },
    ],
  },
  {
    kind: "segmented",
    id: "time.timeFormat",
    section: "weather",
    ...asString(field("dateTime", "timeFormat"), (value) =>
      value === "12h" ? "12h" : "24h",
    ),
    title: "Time format",
    description: "Used for the hours in the weather forecast.",
    keywords: ["clock", "hour", "am", "pm", "12", "24"],
    icon: ClockIcon,
    options: [
      { value: "24h", label: "24-hour" },
      { value: "12h", label: "12-hour" },
    ],
  },
  {
    kind: "segmented",
    id: "time.forecastDays",
    section: "weather",
    ...asString(field("dateTime", "forecastDays"), Number),
    title: "Show days ahead",
    description: "How many days the weather forecast shows, today included.",
    keywords: ["weather", "days", "week", "long", "far ahead", "length"],
    icon: CalendarCheckIcon,
    // Saved as the days after today, so what people picked before still means the same.
    options: Array.from(
      { length: MAX_EXTRA_FORECAST_DAYS + 1 },
      (_, index) => ({
        value: String(index),
        label: String(index + 1),
      }),
    ),
  },
  {
    kind: "segmented",
    id: "appearance.theme",
    section: "appearance",
    ...asString(field("appearance", "theme"), (value) =>
      THEMES.some(({ id }) => id === value) ? (value as ThemeId) : "system",
    ),
    title: "Theme",
    description: "Light, dark, or whatever your system wants.",
    keywords: [
      "dark",
      "light",
      "mode",
      "night",
      "appearance",
      "system",
      "colour",
    ],
    icon: CircleHalfIcon,
    options: THEMES.map(({ id, label }) => ({ value: id, label })),
  },
  {
    kind: "swatches",
    id: "appearance.accent",
    section: "appearance",
    ...asString(field("appearance", "accent"), (value) =>
      ACCENTS.some(({ id }) => id === value) ? (value as AccentId) : "sky",
    ),
    title: "Accent colour",
    description: "Buttons, switches and highlights.",
    keywords: ["theme", "colour", "color", "blue", "highlight", "palette"],
    icon: PaletteIcon,
    options: ACCENTS.map(({ id, label, swatch, checkColor }) => ({
      value: id,
      label,
      color: swatch,
      checkColor,
    })),
  },
  {
    kind: "switch",
    id: "appearance.disableFun",
    section: "appearance",
    ...field("appearance", "disableFun"),
    title: "I don't like fun",
    description: "No holiday surprises for you. Sinterklaas will be sad.",
    keywords: [
      "easter egg",
      "sinterklaas",
      "holiday",
      "christmas",
      "animation",
      "surprise",
    ],
    icon: ConfettiIcon,
  },
  // Only while developing: the dev build sets VITE_IS_DEV, and production builds drop this.
  ...(import.meta.env.VITE_IS_DEV === "true"
    ? ([
        {
          kind: "custom",
          id: "dev.eggs",
          section: "appearance",
          content: "devEggs",
          title: "(DEV) Play an easter egg",
          description: "Shows an egg now, whatever the date or the odds.",
          keywords: ["easter egg", "sinterklaas", "christmas", "debug", "dev"],
          icon: EggIcon,
        },
      ] satisfies SettingEntry[])
    : []),
  {
    kind: "switch",
    id: "sidebar.showUpdates",
    section: "appearance",
    ...field("sidebar", "showUpdates"),
    title: "Update news",
    description: "Tells you when UpTab has something new. No spam, promise.",
    keywords: ["notification", "changelog", "what's new", "release"],
    icon: BellRingingIcon,
  },
  {
    kind: "segmented",
    id: "sidebar.feedbackFrequency",
    section: "appearance",
    ...asString(field("sidebar", "feedbackFrequency"), (value) =>
      value === "monthly" || value === "never" ? value : "quarterly",
    ),
    title: "Feedback requests",
    description: "How often UpTab asks what you think.",
    keywords: ["notification", "survey", "ask", "prompt", "nudge", "often"],
    icon: MegaphoneIcon,
    options: [
      { value: "monthly", label: "Monthly" },
      { value: "quarterly", label: "3 months" },
      { value: "never", label: "Never" },
    ],
  },
  {
    kind: "switch",
    id: "privacy.errorReporting",
    section: "appearance",
    ...field("privacy", "errorReporting"),
    confirmChange: async (to) => {
      if (to) {
        return requestErrorReporting();
      }

      await revokeErrorReporting();

      return true;
    },
    title: "Error reports",
    description:
      "Sends a report when UpTab breaks, so bugs get fixed. It never includes page addresses, locations, bookmarks or searches.",
    keywords: ["crash", "bug", "telemetry", "diagnostics", "privacy", "sentry"],
    icon: BugBeetleIcon,
  },
  {
    kind: "custom",
    id: "general.about",
    section: "general",
    content: "about",
    title: "About UpTab",
    description: "The version you're on, what's new and whether there's more.",
    keywords: [
      "version",
      "update",
      "changelog",
      "latest",
      "release",
      "credit",
      "author",
    ],
    icon: InfoIcon,
  },
];
