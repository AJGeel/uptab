import { storage } from "webextension-polyfill";

export const setUpdateNotification = (newState: boolean) => {
  storage.local.set({
    newUpdate: newState,
  });
};
