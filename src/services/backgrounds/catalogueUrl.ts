/** Override with VITE_CATALOGUE_URL to test against a local uptab-website. */
export const CATALOGUE_URL =
  import.meta.env.VITE_CATALOGUE_URL ??
  "https://uptab.vercel.app/backgrounds/v1/catalogue.json";
