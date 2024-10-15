import { history } from "webextension-polyfill";

const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;

const duration = {
  week: new Date().getTime() - millisecondsPerWeek,
  month: new Date().getTime() - millisecondsPerWeek * 4,
} as const;

export const getHistory = () =>
  history.search({ text: "", startTime: duration.month, maxResults: 1000 });

interface HistoryItem {
  id: string;
  url?: string;
  title?: string;
  lastVisitTime?: number;
  visitCount?: number;
  typedCount?: number;
}

interface OrganisedHistory {
  [date: string]: {
    [hour: string]: HistoryItem[];
  };
}

// TODO: This is buggy. Should be fixed.
export const organiseHistory = (history: HistoryItem[]) => {
  const organized: OrganisedHistory = {};

  history.forEach((item) => {
    if (item.lastVisitTime) {
      const date = new Date(item.lastVisitTime);
      const dateString = date.toISOString().split("T")[0]; // YYYY-MM-DD
      const hourString = date
        .getUTCHours()
        .toString()
        .padStart(2, "0")
        .padEnd(2, "0"); // HH

      if (!organized[dateString]) {
        organized[dateString] = {};
      }
      if (!organized[dateString][hourString]) {
        organized[dateString][hourString] = [];
      }

      organized[dateString][hourString].push(item);
    }
  });

  return organized;
};
