import { storage } from "webextension-polyfill";

import { getShortlinks } from "./getShortlinks";
import { UUID } from "./types";

export const deleteShortlink = async (id: UUID) => {
  const existingItems = await getShortlinks();
  const updatedItems = existingItems.filter((item) => item.id !== id);
  await storage.local.set({ shortlinks: updatedItems });
};
