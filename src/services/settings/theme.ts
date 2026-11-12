import { ThemeId } from "./types";

export const THEMES: { id: ThemeId; label: string }[] = [
  { id: "system", label: "System" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

export const DARK_QUERY = "(prefers-color-scheme: dark)";

const STORAGE_KEY = "uptab.theme";

const isTheme = (value: string | null): value is ThemeId =>
  THEMES.some(({ id }) => id === value);

/** "System" follows the browser or OS, which the page only knows by asking. */
export const resolveTheme = (theme: ThemeId): "light" | "dark" => {
  if (theme === "system") {
    return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
  }

  return theme;
};

/** Sets the colours on the page. Its colours are in tailwind.css, under `data-theme`. */
export const applyTheme = (theme: ThemeId) => {
  document.documentElement.dataset.theme = resolveTheme(theme);

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Without it, the next page starts in the system's colours for a moment.
  }
};

/**
 * Applies the last theme before the first paint: the settings load a moment
 * later, and the page would flash the wrong colours until they do.
 */
export const restoreTheme = () => {
  let theme: ThemeId = "system";

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (isTheme(stored)) {
      theme = stored;
    }
  } catch {
    // The settings apply it in a moment.
  }

  document.documentElement.dataset.theme = resolveTheme(theme);
};
