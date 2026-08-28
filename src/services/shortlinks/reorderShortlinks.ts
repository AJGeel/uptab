import { storage } from "webextension-polyfill";

import { Shortlink } from "./types";

export const reorderShortlinks = async (shortlinks: Shortlink[]) => {
    await storage.local.set({ shortlinks });
};