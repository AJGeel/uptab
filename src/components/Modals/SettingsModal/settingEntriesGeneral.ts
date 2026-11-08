import {
  CalendarBlankIcon,
  CalendarCheckIcon,
  CalendarDotsIcon,
  ClockIcon,
  CloudSunIcon,
  InfoIcon,
  PaletteIcon,
  ThermometerIcon,
  ThermometerSimpleIcon,
  WindIcon,
} from "@phosphor-icons/react";

import { ACCENTS } from "@/src/services/settings/accents";
import { AccentId } from "@/src/services/settings/types";
import { MAX_EXTRA_FORECAST_DAYS } from "@/src/services/weather/constants";

import { asString, field, SettingEntry } from "./settingsTypes";

export const generalEntries: SettingEntry[] = [
  {
    kind: "custom",
    id: "weather.location",
    section: "weather",
    content: "location",
    title: "Location",
    description: "Your weather follows the location you select here.",
    keywords: ["gps", "city", "place", "forecast", "saved", "current"],
    icon: CloudSunIcon,
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
    section: "time",
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
    section: "time",
    ...asString(field("dateTime", "forecastDays"), Number),
    title: "Forecast length",
    description: "How many days after today the weather forecast shows.",
    keywords: ["weather", "days", "week", "long", "far ahead"],
    icon: CalendarCheckIcon,
    options: Array.from({ length: MAX_EXTRA_FORECAST_DAYS }, (_, index) => ({
      value: String(index + 1),
      label: String(index + 1),
    })),
  },
  {
    kind: "switch",
    id: "time.showWeekNumber",
    section: "time",
    ...field("dateTime", "showWeekNumber"),
    title: "Week number",
    description: "Shows which week of the year it is, under the date.",
    keywords: ["calendar", "date", "widget"],
    icon: CalendarDotsIcon,
  },
  {
    kind: "segmented",
    id: "time.weekStartsOn",
    section: "time",
    ...asString(field("dateTime", "weekStartsOn"), (value) =>
      value === "sunday" ? "sunday" : "monday",
    ),
    title: "Weeks start on",
    description: "Decides how the week number is counted.",
    keywords: ["calendar", "monday", "sunday", "first day"],
    icon: CalendarBlankIcon,
    options: [
      { value: "monday", label: "Monday" },
      { value: "sunday", label: "Sunday" },
    ],
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
    options: ACCENTS.map(({ id, label, swatch }) => ({
      value: id,
      label,
      color: swatch,
    })),
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
