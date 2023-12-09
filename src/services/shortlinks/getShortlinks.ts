import { storage } from "webextension-polyfill";

import { Shortlink } from "./types";

export const getShortlinks = async (): Promise<Shortlink[]> => {
  const data = (await storage.local.get("shortlinks")) as {
    shortlinks?: Shortlink[];
  };

  if (!data.shortlinks) {
    return [];
  }

  return data.shortlinks;
};
