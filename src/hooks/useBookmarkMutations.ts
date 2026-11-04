import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookmarks } from "webextension-polyfill";

import type { BookmarkChanges } from "@/src/components/Bookmarks/partials/EditBookmarkModal";
import { setBookmarkIcon } from "@/src/services/bookmarks/bookmarkIcons";
import { addRecentIcon } from "@/src/services/recentIcons";

import { BOOKMARK_ICONS_QUERY_KEY } from "./queries/useBookmarkIcons";
import { BOOKMARKS_QUERY_KEY } from "./queries/useBookmarks";
import { RECENT_ICONS_QUERY_KEY } from "./queries/useRecentIcons";

export const useBookmarkMutations = (onEdited: () => void) => {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: BOOKMARKS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: BOOKMARK_ICONS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: RECENT_ICONS_QUERY_KEY });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await bookmarks.remove(id);
      await setBookmarkIcon(id, "");
    },
    onSuccess: refresh,
  });

  const editMutation = useMutation({
    mutationFn: async ({
      id,
      icon,
      ...changes
    }: BookmarkChanges & { id: string }) => {
      await bookmarks.update(id, changes);
      await setBookmarkIcon(id, icon);
      await addRecentIcon(icon);
    },
    onSuccess: () => {
      refresh();
      onEdited();
    },
  });

  return { deleteMutation, editMutation };
};
