export const buildTargets = {
  chromium: "chrome",
  firefox: "firefox",
} as const;

export const buildTarget: (typeof buildTargets)[keyof typeof buildTargets] =
  buildTargets.chromium;
