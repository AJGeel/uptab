import { permissions } from "webextension-polyfill";

import { supportsDataConsent } from "@/src/utils/firefox";

type DataRequest = Parameters<typeof permissions.request>[0];

const ERROR_REPORTS = {
  data_collection: ["technicalAndInteraction"],
} as unknown as DataRequest;

/**
 * Asks Firefox 140+ for the data category, so what it shows matches what
 * happens. Elsewhere there's nothing to ask: the setting is the consent. Has to
 * be called straight from a click.
 */
export const requestErrorReporting = (): Promise<boolean> =>
  supportsDataConsent()
    ? permissions.request(ERROR_REPORTS)
    : Promise.resolve(true);

export const revokeErrorReporting = async () => {
  if (supportsDataConsent()) {
    await permissions.remove(ERROR_REPORTS).catch(() => false);
  }
};
