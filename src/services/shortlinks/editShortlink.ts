import { storage } from "webextension-polyfill";
import { getShortlinks } from "./getShortlinks";
import { Shortlink } from "./types";

export const editShortlink = async (editedItem: Shortlink) => {
  const existingItems = await getShortlinks();
  const updatedItems = [
    ...existingItems.filter((item) => item.id !== editedItem.id),
    editedItem,
  ];
  await storage.local.set({ shortlinks: updatedItems });
};
