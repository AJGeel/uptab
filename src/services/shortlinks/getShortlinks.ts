import { storage } from "webextension-polyfill";
import { Shortlink } from "./types";

export const getShortlinks = async (): Promise<Shortlink[]> => {
  const shortlinks = (await storage.local.get("shortlinks")) as Shortlink[];

  if (!shortlinks.length) {
    return [];
  }

  return shortlinks;
};
