import { useQuery } from "@tanstack/react-query";
import { Bookmarks, history } from "webextension-polyfill";

import { buildVisits, canonicalizeUrl } from "@/src/services/bookmarks/visits";

/** A page without visits, or one the history can't look up. */
const getPageVisits = async (url: string) => {
  try {
    const visits = await history.getVisits({ url: canonicalizeUrl(url) });

    return {
      url,
      visitCount: visits.length,
      lastVisitTime: visits.reduce(
        (latest, visit) => Math.max(latest, visit.visitTime ?? 0),
        0,
      ),
    };
  } catch {
    return { url };
  }
};

/**
 * How often and when each bookmark was visited. Looks up every bookmark's own
 * page, which stays quick however long the history is, unlike reading all of it.
 */
export const useBookmarkVisits = (
  bookmarks: Bookmarks.BookmarkTreeNode[],
  isEnabled: boolean,
) =>
  useQuery({
    enabled: isEnabled,
    queryFn: async () => {
      const urls = new Set(bookmarks.flatMap(({ url }) => (url ? [url] : [])));

      return buildVisits(await Promise.all([...urls].map(getPageVisits)));
    },
    queryKey: ["bookmarkVisits", bookmarks.length],
    staleTime: 60 * 1000,
  });
