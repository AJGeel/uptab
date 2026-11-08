/*
 * Sets the theme before the first paint, which the app's own code is too late
 * for: a new tab would flash white first. Keep in step with
 * src/services/settings/theme.ts, whose storage key and values this reads.
 */
try {
  const stored = localStorage.getItem("uptab.theme");
  const isDark =
    stored === "dark" ||
    (stored !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);

  document.documentElement.dataset.theme = isDark ? "dark" : "light";
} catch {
  // The app applies it in a moment.
}
