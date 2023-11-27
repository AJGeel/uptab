import { storage } from "webextension-polyfill";
import { getShortlinks } from "./getShortlinks";
import { Shortlink } from "./types";

export const deleteShortlink = async (deletedItem: Shortlink) => {
  const existingItems = await getShortlinks();
  const updatedItems = existingItems.filter(
    (item) => item.id !== deletedItem.id
  );
  await storage.local.set({ shortlinks: updatedItems });
};
