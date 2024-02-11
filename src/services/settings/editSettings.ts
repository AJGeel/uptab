import { storage } from "webextension-polyfill";

import { Settings } from "./types";

export const editSettings = async (newSettings: Settings) => {
  await storage.local.set({ settings: newSettings });
};
