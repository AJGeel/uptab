import { useQuery } from "@tanstack/react-query";
import { bookmarks } from "webextension-polyfill";

import { mapBookmarks } from "@/src/services/bookmarks/mapBookmarks";

export const BOOKMARKS_QUERY_KEY = ['bookmarks'] as const

export const useBookmarks = () => useQuery({
    queryFn: async () => await bookmarks.getTree(),
    select: (bookmarks) => mapBookmarks(bookmarks).filter((item) => !!item.url),
    queryKey: BOOKMARKS_QUERY_KEY,
})