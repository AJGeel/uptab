const UPTAB_SITE_ORIGIN = "https://uptab.vercel.app";

// The order matters: Edge and Opera also say "Chrome" in their user agent.
const browsers = [
  ["Edge", /\b(?:Edg|EdgA|EdgiOS)\/(\d+)/],
  ["Opera", /\bOPR\/(\d+)/],
  ["Firefox", /\b(?:Firefox|FxiOS)\/(\d+)/],
  ["Chrome", /\b(?:Chrome|CriOS)\/(\d+)/],
] as const;

// Android also says "Linux", and iOS also says "Mac OS X".
const systems = [
  ["Android", /Android/],
  ["iOS", /iPhone|iPad|iPod/],
  ["ChromeOS", /CrOS/],
  ["Windows", /Windows/],
  ["macOS", /Macintosh|Mac OS X/],
  ["Linux", /Linux|X11/],
] as const;

const describeBrowser = (userAgent: string) => {
  const browser = browsers.find(([, pattern]) => pattern.test(userAgent));
  const system = systems.find(([, pattern]) => pattern.test(userAgent));

  if (!browser || !system) {
    return undefined;
  }

  return `${browser[0]} ${userAgent.match(browser[1])?.[1]} · ${system[0]}`;
};

/** The site accepts only these characters in a version, and drops the rest. */
const VERSION_PATTERN = /^[0-9A-Za-z.+-]{1,32}$/;

/** Where to send feedback: the site's form, told which version and browser it came from. */
export const buildFeedbackUrl = (version: string, userAgent: string) => {
  const url = new URL("/feedback", UPTAB_SITE_ORIGIN);
  const browser = describeBrowser(userAgent);
  const cleanVersion = version.replace(/^v/, "");

  if (VERSION_PATTERN.test(cleanVersion)) {
    url.searchParams.set("v", cleanVersion);
  }

  if (browser) {
    url.searchParams.set("browser", browser);
  }

  return url.toString();
};
