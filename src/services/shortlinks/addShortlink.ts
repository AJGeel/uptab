import { storage } from "webextension-polyfill";

import { getShortlinks } from "./getShortlinks";
import { Shortlink } from "./types";

export const addShortlink = async (newItem: Shortlink) => {
  const existingItems = (await getShortlinks()).filter(
    (item) => item.id !== newItem.id
  );
  const updatedItems = [...existingItems, newItem];
  await storage.local.set({ shortlinks: updatedItems });
};
