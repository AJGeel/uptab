export const TARGETS = {
  CHROMIUM: "CHROMIUM",
  FIREFOX: "FIREFOX",
} as const;

export const buildTarget: keyof typeof TARGETS = TARGETS.CHROMIUM;
