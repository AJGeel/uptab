import deepmerge from "deepmerge";
import { storage } from "webextension-polyfill";

import { defaultSettings } from "./defaultSettings";
import { BackgroundSettings, Settings } from "./types";

export const SYNCED_BACKGROUNDS_KEY = "backgroundSettings";

export const getSettings = async (): Promise<Settings> => {
  const [local, synced] = await Promise.all([
    storage.local.get("settings") as Promise<{ settings?: Partial<Settings> }>,
    storage.sync.get(SYNCED_BACKGROUNDS_KEY) as Promise<{
      [SYNCED_BACKGROUNDS_KEY]?: BackgroundSettings;
    }>,
  ]);
  
  const backgrounds =
    synced[SYNCED_BACKGROUNDS_KEY] ?? local.settings?.backgrounds;
  const saved = { ...local.settings, ...(backgrounds && { backgrounds }) };

  return deepmerge(defaultSettings, saved, {
    arrayMerge: (_defaults, savedArray) => savedArray,
  });
};
