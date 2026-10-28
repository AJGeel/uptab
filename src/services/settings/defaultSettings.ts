import { Settings } from "./types";
import { DEFAULT_FORECAST_DAYS } from "../weather/constants";

export const defaultSettings: Settings = {
  sidebar: {
    showShortlinks: true,
    showBookmarks: true,
    showUpdates: true,
    showInfoWidget: true,
    showFeedbackPrompt: true,
    isOpen: false,
    shortlinkColumns: 2,
  },
  homescreen: {
    showInfoWidget: true,
    showPhotoCredit: true,
    showPreferencesButton: true,
  },
  backgrounds: {
    themes: [],
    photoChange: "daily",
  },
  location: {
    active: "gps",
    saved: [],
  },
  units: {
    temperature: "celsius",
    wind: "kmh",
  },
  dateTime: {
    timeFormat: "24h",
    showWeekNumber: true,
    weekStartsOn: "monday",
    forecastDays: DEFAULT_FORECAST_DAYS,
  },
  forecast: {
    showFeelsLike: true,
  },
  appearance: {
    accent: "sky",
  },
};
