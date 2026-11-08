import { AccentId } from "./types";

/**
 * The colours to choose from, in rainbow order. Their ramps are in tailwind.css,
 * under `data-accent`. Blue is the page's own, so it needs none. Rainbow's ramp
 * is animated, and never stops moving through the others.
 */
export const ACCENTS: {
  id: AccentId;
  label: string;
  swatch: string;
  /** For the check mark on the swatch, when white wouldn't show. */
  checkColor?: string;
}[] = [
  { id: "rose", label: "Red", swatch: "oklch(58.6% 0.253 17.585)" },
  { id: "orange", label: "Orange", swatch: "oklch(64.6% 0.222 41.116)" },
  {
    id: "yellow",
    label: "Yellow",
    swatch: "oklch(83% 0.175 90)",
    checkColor: "oklch(24% 0.05 70)",
  },
  { id: "emerald", label: "Green", swatch: "oklch(59.6% 0.145 163.225)" },
  { id: "sky", label: "Blue", swatch: "#138cd0" },
  { id: "indigo", label: "Indigo", swatch: "oklch(51.1% 0.262 276.966)" },
  { id: "violet", label: "Violet", swatch: "oklch(54.1% 0.281 293.009)" },
  { id: "pink", label: "Pink", swatch: "oklch(59.2% 0.249 0.584)" },
  {
    id: "rainbow",
    label: "Rainbow",
    swatch:
      "conic-gradient(from var(--swatch-spin) in oklch, oklch(65% 0.24 0), oklch(65% 0.24 45), oklch(65% 0.24 90), oklch(65% 0.24 135), oklch(65% 0.24 180), oklch(65% 0.24 225), oklch(65% 0.24 270), oklch(65% 0.24 315), oklch(65% 0.24 360))",
  },
];

const STORAGE_KEY = "uptab.accent";

const isAccent = (value: string | null): value is AccentId =>
  ACCENTS.some(({ id }) => id === value);

/** Sets the accent on the page. The default one is the page's own colours. */
export const applyAccent = (accent: AccentId) => {
  if (accent === "sky") {
    delete document.documentElement.dataset.accent;
  } else {
    document.documentElement.dataset.accent = accent;
  }

  try {
    localStorage.setItem(STORAGE_KEY, accent);
  } catch {
    // Without it, the next page starts in the default colour for a moment.
  }
};

/**
 * Applies the last accent before the first paint: the settings load a moment
 * later, and the page would flash the default colour until they do.
 */
export const restoreAccent = () => {
  try {
    const accent = localStorage.getItem(STORAGE_KEY);

    if (isAccent(accent) && accent !== "sky") {
      document.documentElement.dataset.accent = accent;
    }
  } catch {
    // The settings apply it in a moment.
  }
};
