import { storage } from "webextension-polyfill";

export const getUpdateNotification = async () =>
  (await storage.local.get("newUpdate")) as {
    newUpdate?: boolean;
  };
