import { useQuery } from "@tanstack/react-query";

import {
  getCatalogue,
  getSavedCatalogue,
} from "@/src/services/backgrounds/getCatalogue";

const ONE_HOUR = 60 * 60 * 1000;

/**
 * The saved catalogue is used straight away, and a fresh one is fetched in the
 * background for the next tab. Only on the very first run, with nothing saved
 * yet, does this tab wait for the network.
 */
export const useCatalogue = () => {
  const saved = useQuery({
    queryKey: ["backgroundCatalogue", "saved"],
    queryFn: getSavedCatalogue,
    staleTime: Infinity,
    // Reads local storage only, so don't pause while the browser is offline.
    networkMode: "always",
  });

  const remote = useQuery({
    queryKey: ["backgroundCatalogue", "remote"],
    queryFn: () => getCatalogue(),
    staleTime: ONE_HOUR,
    // Falls back to the saved copy itself when offline.
    networkMode: "always",
  });

  return {
    // The saved copy wins for this tab, so the photo never changes mid-tab.
    catalogue: saved.data ?? remote.data ?? null,
    isPending: saved.isPending || (saved.data === null && remote.isPending),
  };
};
