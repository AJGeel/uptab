import { useQuery } from "@tanstack/react-query";
import { runtime } from "webextension-polyfill";

import { parseReleaseNotes } from "@/src/services/changelog/parseChangelog";

export const useReleaseNotes = (enabled: boolean) =>
  useQuery({
    queryKey: ["releaseNotes", runtime.getManifest().version],
    queryFn: async () => {
      const response = await fetch("/CHANGELOG.md");

      if (!response.ok) {
        throw new Error("Couldn't read the changelog");
      }

      return (
        parseReleaseNotes(
          await response.text(),
          runtime.getManifest().version,
        ) ?? null
      );
    },
    enabled,
    staleTime: Infinity,
    networkMode: "always",
  });
