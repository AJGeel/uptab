export const TARGETS = {
  FIREFOX: "FIREFOX",
  CHROMIUM: "CHROMIUM",
} as const;

export const buildTarget: keyof typeof TARGETS = TARGETS.CHROMIUM;
