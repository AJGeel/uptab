import { LocationSettings } from "../location/types";

export type FeedbackFrequency = "monthly" | "quarterly" | "never";

export type SidebarSettings = {
  showShortlinks: boolean;
  showBookmarks: boolean;
  showUpdates: boolean;
  showInfoWidget: boolean;
  showFeedbackPrompt: boolean;
  /** How often the feedback ask replaces the update notification. */
  feedbackFrequency: FeedbackFrequency;
  isOpen: boolean;
  shortlinkColumns: 1 | 2;
};

export type HomescreenSettings = {
  showInfoWidget: boolean;
  showPhotoCredit: boolean;
  /** The button that opens the backgrounds picker, next to the arrows. */
  showBackgroundsButton: boolean;
  /** A shortcut to the preferences, in the bottom right corner. */
  showPreferencesButton: boolean;
};

export type TemperatureUnit = "celsius" | "fahrenheit";

export type WindUnit = "kmh" | "mph";

export type UnitSettings = {
  temperature: TemperatureUnit;
  wind: WindUnit;
};

export type TimeFormat = "24h" | "12h";
export type WeekStart = "monday" | "sunday";

export type DateTimeSettings = {
  timeFormat: TimeFormat;
  showWeekNumber: boolean;
  weekStartsOn: WeekStart;
  /** How many days the weather forecast shows, today included. */
  forecastDays: number;
};

export type PhotoChange = "daily" | "sixHours" | "hourly" | "everyTab";

export type BackgroundSettings = {
  /** Enabled theme IDs from the backgrounds catalogue. Empty: all of them. */
  themes: string[];
  /** How long a photo lasts: a day, six hours, an hour, or a new tab. */
  photoChange: PhotoChange;
};

export type ForecastSettings = {
  /** The "feels like" line in the forecast's tooltip. */
  showFeelsLike: boolean;
};

export type AccentId =
  | "rose"
  | "orange"
  | "yellow"
  | "emerald"
  | "sky"
  | "indigo"
  | "violet"
  | "pink";

export type AppearanceSettings = {
  accent: AccentId;
};

export type Settings = {
  sidebar: SidebarSettings;
  homescreen: HomescreenSettings;
  backgrounds: BackgroundSettings;
  location: LocationSettings;
  units: UnitSettings;
  dateTime: DateTimeSettings;
  forecast: ForecastSettings;
  appearance: AppearanceSettings;
};
