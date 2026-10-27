import { useEffect, useState } from "react";
import { permissions } from "webextension-polyfill";

const HISTORY = { permissions: ["history" as const] };

/**
 * Whether UpTab may read the browser's history, which is only asked for when
 * someone sorts by visits. `undefined` until it's known.
 */
export const useHistoryAccess = () => {
  const [hasAccess, setHasAccess] = useState<boolean>();

  useEffect(() => {
    let isCurrent = true;

    const update = async () => {
      const granted = await permissions.contains(HISTORY);

      if (isCurrent) {
        setHasAccess(granted);
      }
    };

    void update();
    // Also when it's changed in the browser's extension settings.
    permissions.onAdded.addListener(update);
    permissions.onRemoved.addListener(update);

    return () => {
      isCurrent = false;
      permissions.onAdded.removeListener(update);
      permissions.onRemoved.removeListener(update);
    };
  }, []);

  /** Browsers only allow asking straight from a click, so don't `await` before it. */
  const requestAccess = async () => {
    const isGranted = await permissions.request(HISTORY);

    // Don't wait for the browser's event, so a choice made right after still works.
    if (isGranted) {
      setHasAccess(true);
    }

    return isGranted;
  };

  return { hasAccess, requestAccess };
};
