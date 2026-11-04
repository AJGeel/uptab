import { useQuery } from "@tanstack/react-query";

import { getBookmarkIcons } from "@/src/services/bookmarks/bookmarkIcons";

export const BOOKMARK_ICONS_QUERY_KEY = ["bookmarkIcons"] as const;

export const useBookmarkIcons = () =>
  useQuery({
    queryFn: getBookmarkIcons,
    queryKey: BOOKMARK_ICONS_QUERY_KEY,
  });
