import { useEffect } from "react";

import { applyAccent } from "@/src/services/settings/accents";

import { useSettings } from "./useSettings";

/** Puts the chosen accent colour on the page, and keeps it there as it changes. */
export const useAccent = () => {
  const accent = useSettings().data?.appearance.accent;

  useEffect(() => {
    if (accent) {
      applyAccent(accent);
    }
  }, [accent]);
};
