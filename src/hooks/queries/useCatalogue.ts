import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchCatalogue,
  getCatalogue,
  getSavedCatalogue,
} from "@/src/services/backgrounds/getCatalogue";

const ONE_HOUR = 60 * 60 * 1000;
const SAVED_KEY = ["backgroundCatalogue", "saved"];
const REMOTE_KEY = ["backgroundCatalogue", "remote"];

/**
 * The saved catalogue is used straight away, and a fresh one is fetched in the
 * background for the next tab. Only on the very first run, with nothing saved
 * yet, does this tab wait for the network.
 */
export const useCatalogue = () => {
  const queryClient = useQueryClient();
  const saved = useQuery({
    queryKey: SAVED_KEY,
    queryFn: getSavedCatalogue,
    staleTime: Infinity,
    // Reads local storage only, so don't pause while the browser is offline.
    networkMode: "always",
  });

  const remote = useQuery({
    queryKey: REMOTE_KEY,
    queryFn: () => getCatalogue(),
    staleTime: ONE_HOUR,
    // Falls back to the saved copy itself when offline.
    networkMode: "always",
  });

  // On request, skipping the HTTP cache, and shown in this tab straight away.
  const refresh = useMutation({
    mutationFn: () => fetchCatalogue({ reload: true }),
    networkMode: "always",
    onSuccess: (fresh) => {
      if (fresh) {
        queryClient.setQueryData(SAVED_KEY, fresh);
        queryClient.setQueryData(REMOTE_KEY, fresh);
      }
    },
  });

  return {
    // The saved copy wins for this tab, so the photo never changes mid-tab.
    catalogue: saved.data ?? remote.data ?? null,
    refresh: refresh.mutateAsync,
    isRefreshing: refresh.isPending,
    isPending: saved.isPending || (saved.data === null && remote.isPending),
  };
};
