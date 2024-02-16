import { storage } from "webextension-polyfill";

import { defaultSettings } from "./defaultSettings";
import { Settings } from "./types";

export const getSettings = async (): Promise<Settings> => {
  const data = (await storage.local.get("settings")) as {
    settings?: Settings;
  };

  if (!data.settings) {
    return defaultSettings;
  }

  // Merge default settings to update clients that may not have newly added keys
  return {
    ...defaultSettings,
    ...data.settings,
  };
};
