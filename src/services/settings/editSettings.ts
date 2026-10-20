import { storage } from "webextension-polyfill";

import { SYNCED_BACKGROUNDS_KEY } from "./getSettings";
import { Settings } from "./types";

export const editSettings = async ({ backgrounds, ...settings }: Settings) => {
  const { [SYNCED_BACKGROUNDS_KEY]: synced } = await storage.sync.get(
    SYNCED_BACKGROUNDS_KEY,
  );

  await Promise.all([
    storage.local.set({ settings }),
    JSON.stringify(synced) !== JSON.stringify(backgrounds) &&
      storage.sync.set({ [SYNCED_BACKGROUNDS_KEY]: backgrounds }),
  ]);
};
