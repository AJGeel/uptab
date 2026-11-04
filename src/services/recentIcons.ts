import { storage } from "webextension-polyfill";

import { isImageUrl } from "@/src/utils/icon";

export const MAX_RECENT_ICONS = 10;

/** The latest image URLs people used as an icon, newest first. */
export const getRecentIcons = async (): Promise<string[]> => {
  const data = (await storage.local.get("recentIcons")) as {
    recentIcons?: string[];
  };

  return data.recentIcons ?? [];
};

/** Emojis aren't kept: they're one click away in the picker. */
export const addRecentIcon = async (icon: string) => {
  if (!isImageUrl(icon)) {
    return;
  }

  const others = (await getRecentIcons()).filter((recent) => recent !== icon);

  await storage.local.set({
    recentIcons: [icon, ...others].slice(0, MAX_RECENT_ICONS),
  });
};
