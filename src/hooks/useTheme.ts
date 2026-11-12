import { useEffect } from "react";

import { applyTheme, DARK_QUERY } from "@/src/services/settings/theme";

import { useSettings } from "./useSettings";

/** Puts the chosen theme on the page, and keeps it there as it, or the system's, changes. */
export const useTheme = () => {
  const theme = useSettings().data?.appearance.theme;

  useEffect(() => {
    if (!theme) {
      return;
    }

    applyTheme(theme);

    if (theme !== "system") {
      return;
    }

    const query = window.matchMedia(DARK_QUERY);
    const onChange = () => applyTheme(theme);

    query.addEventListener("change", onChange);

    return () => query.removeEventListener("change", onChange);
  }, [theme]);
};
