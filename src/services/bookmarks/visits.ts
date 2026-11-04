export type Visit = {
  visitCount: number;
  /** Milliseconds since the epoch, 0 when never visited. */
  lastVisitTime: number;
};

export type Visits = Map<string, Visit>;

type HistoryEntry = {
  url?: string;
  visitCount?: number;
  lastVisitTime?: number;
};

/** The browser adds a slash to bare addresses, so compare them written alike. */
export const canonicalizeUrl = (url: string) => {
  try {
    return new URL(url).href;
  } catch {
    return url;
  }
};

/** Visits by page, adding up entries that are the same page written two ways. */
export const buildVisits = (entries: HistoryEntry[]): Visits => {
  const visits: Visits = new Map();

  entries.forEach(({ url, visitCount = 0, lastVisitTime = 0 }) => {
    if (!url) {
      return;
    }

    const key = canonicalizeUrl(url);
    const known = visits.get(key);

    visits.set(key, {
      visitCount: (known?.visitCount ?? 0) + visitCount,
      lastVisitTime: Math.max(known?.lastVisitTime ?? 0, lastVisitTime),
    });
  });

  return visits;
};

export const getVisit = (visits: Visits, url: string | undefined) =>
  url ? visits.get(canonicalizeUrl(url)) : undefined;
