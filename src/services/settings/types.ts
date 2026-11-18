import { LocationSettings } from "../location/types";
import { SearchEngineId } from "../search/searchEngines";

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
  shortlinkColumns: 1 | 2 | 3;
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

export type DateTimeSettings = {
  timeFormat: TimeFormat;
  /** The days after today the weather forecast shows. Zero is today, and the next 24 hours. */
  forecastDays: number;
};

export type PhotoChange = "daily" | "sixHours" | "hourly" | "everyTab";

export type BackgroundSettings = {
  /** Enabled theme IDs from the backgrounds catalogue. Empty: all of them. */
  themes: string[];
  /** How long a photo lasts: a day, six hours, an hour, or a new tab. */
  photoChange: PhotoChange;
};

export type CalendarSettings = {
  /** "Connect your calendar" under the date, until one is connected. */
  showConnectPrompt: boolean;
  /** The Join pill on events that have a meeting link. */
  showJoinButton: boolean;
  /** The next event under the date on the homescreen. */
  showOnHomescreen: boolean;
  /** The next event under the date in the sidebar. */
  showInSidebar: boolean;
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
  | "pink"
  | "rainbow";

export type ThemeId = "system" | "light" | "dark";

export type AppearanceSettings = {
  theme: ThemeId;
  accent: AccentId;
};

export type PrivacySettings = {
  /** Off until someone turns it on: nothing is sent without it. */
  errorReporting: boolean;
};

export type SearchSettings = {
  /** Where <kbd>Enter</kbd> searches when no bookmark matches. */
  engine: SearchEngineId;
};

export type Settings = {
  sidebar: SidebarSettings;
  homescreen: HomescreenSettings;
  backgrounds: BackgroundSettings;
  location: LocationSettings;
  units: UnitSettings;
  dateTime: DateTimeSettings;
  calendar: CalendarSettings;
  forecast: ForecastSettings;
  appearance: AppearanceSettings;
  privacy: PrivacySettings;
  search: SearchSettings;
};
