import { Settings } from "./types";
import { bgThemes } from "../background/types";

export const defaultSettings: Settings = {
  sidebar: {
    showShortlinks: true,
    showBookmarks: true,
    showUpdates: true,
    showInfoWidget: true,
    isOpen: false,
  },
  homescreen: {
    showFeedbackPrompt: true,
    showInfoWidget: true,
  },
  background: {
    theme: bgThemes.holland,
  },
};
