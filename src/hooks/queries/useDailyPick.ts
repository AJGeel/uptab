import { useQuery, useQueryClient } from "@tanstack/react-query";
import { storage } from "webextension-polyfill";

import { DailyPick } from "@/src/services/backgrounds/pickDailyImage";

const STORAGE_KEY = "dailyBackground";
const DAILY_PICK_QUERY_KEY = [STORAGE_KEY] as const;

/**
 * The photo picked for today, shared by everything that shows it, so browsing
 * updates them all. Kept in storage.sync, so it follows the user to their other
 * browsers; those pick it up in their next new tab.
 */
export const useDailyPick = () => {
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery({
    queryKey: DAILY_PICK_QUERY_KEY,
    queryFn: async () =>
      ((await storage.sync.get(STORAGE_KEY))[STORAGE_KEY] as
        DailyPick | undefined) ?? null,
    staleTime: Infinity,
    // Reads extension storage only, so don't pause while the browser is offline.
    networkMode: "always",
  });

  const setPick = (pick: DailyPick) => {
    queryClient.setQueryData(DAILY_PICK_QUERY_KEY, pick);
    // Over sync's write limit (Chrome: 120 a minute), the pick stays in this tab only.
    storage.sync.set({ [STORAGE_KEY]: pick }).catch(() => {});
  };

  return { pick: data ?? null, isHydrated: !isPending, setPick };
};
