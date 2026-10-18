import { Settings } from "./types";
import { DEFAULT_THEME } from "../backgrounds/pickDailyImage";

export const defaultSettings: Settings = {
  sidebar: {
    showShortlinks: true,
    showBookmarks: true,
    showUpdates: true,
    showInfoWidget: true,
    showFeedbackPrompt: true,
    isOpen: false,
  },
  homescreen: {
    showInfoWidget: true,
    showPhotoCredit: true,
  },
  backgrounds: {
    themes: [DEFAULT_THEME],
  },
};
