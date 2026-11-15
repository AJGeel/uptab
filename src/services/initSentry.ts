import { storage } from "webextension-polyfill";

import { scrubBreadcrumb, scrubEvent } from "./errorReporting/scrub";
import { getSettings } from "./settings/getSettings";

let isRunning = false;

const start = async (dsn: string) => {
  if (isRunning) {
    return;
  }

  isRunning = true;
  const Sentry = await import("@sentry/browser");

  // Switched off again while it was loading.
  if (!isRunning) {
    return;
  }

  Sentry.init({
    dsn,
    // These record web addresses, which carry places and searches.
    integrations: [
      Sentry.breadcrumbsIntegration({
        fetch: false,
        xhr: false,
        history: false,
      }),
    ],
    beforeBreadcrumb: scrubBreadcrumb,
    beforeSend: scrubEvent,
  });
};

const stop = async () => {
  if (!isRunning) {
    return;
  }

  isRunning = false;
  const Sentry = await import("@sentry/browser");
  await Sentry.close();
};

/** Reports errors only for people who turned it on, and stops when they turn it off. */
export const initSentry = () => {
  const dsn = import.meta.env.VITE_GLITCHTIP_DSN;

  if (!dsn) {
    return;
  }

  const sync = async () => {
    const { privacy } = await getSettings();

    await (privacy.errorReporting ? start(dsn) : stop());
  };

  const load = () => {
    void sync();
    storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.settings) {
        void sync();
      }
    });
  };

  if ("requestIdleCallback" in window) {
    requestIdleCallback(load, { timeout: 3000 });
  } else {
    setTimeout(load, 1000);
  }
};
