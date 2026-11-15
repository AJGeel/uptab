import { useEffect, useState } from "react";
import { permissions } from "webextension-polyfill";

import { isFirefox, supportsDataConsent } from "@/src/utils/firefox";

const GEOLOCATION = { permissions: ["geolocation" as const] };

/**
 * Whether UpTab may use the current location. Only Firefox has it as an
 * optional permission; Chrome asks by itself the first time, so it's always
 * `true` there. `undefined` until it's known.
 */
export const useLocationAccess = () => {
  const [hasAccess, setHasAccess] = useState<boolean | undefined>(() =>
    isFirefox ? undefined : true,
  );

  useEffect(() => {
    if (!isFirefox) {
      return;
    }

    let isCurrent = true;

    const update = async () => {
      const granted = await permissions.contains(GEOLOCATION);

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

  /**
   * Browsers only allow asking straight from a click, so don't `await` before
   * it. Firefox 140+ also gets asked for the matching data category, so what
   * it shows at install matches what happens.
   */
  const requestAccess = async () => {
    const isGranted = await permissions.request({
      ...GEOLOCATION,
      ...(supportsDataConsent() && { data_collection: ["locationInfo"] }),
    } as Parameters<typeof permissions.request>[0]);

    if (isGranted) {
      setHasAccess(true);
    }

    return isGranted;
  };

  return { hasAccess, requestAccess };
};
