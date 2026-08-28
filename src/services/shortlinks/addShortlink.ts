import { storage } from "webextension-polyfill";

import { getShortlinks } from "./getShortlinks";
import { Shortlink } from "./types";

export const addShortlink = async (newItem: Shortlink) => {
  const existingItems = await getShortlinks();

  await storage.local.set({
    shortlinks: [...existingItems, newItem],
  });
};
