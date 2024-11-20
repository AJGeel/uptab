import { history } from "webextension-polyfill";

type GetHistoryParams = {
  query: string;
  endTime?: number; // milliseconds since the epoch
  maxResults?: number;
  startTime?: number; // Limit results to those visited after this date, represented in milliseconds since the epoch.
};

/**
 * Uses webextension's History API: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/history
 * @TODO Implement pagination or sane defaults for maxResults. Now using 1000.
 * Other supported params: https://developer.chrome.com/docs/extensions/reference/api/history#parameters_5
 */
export const getHistory = ({ query }: GetHistoryParams) =>
  history.search({
    text: query,
    maxResults: 1000,
    startTime: 0,
  });
