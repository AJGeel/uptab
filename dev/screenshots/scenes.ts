import type { Page } from "playwright";

import { addLocalPhotos, type Stage, waitForImages } from "./seed";

export type Scene = {
  id: string;
  /** Two lines; the second is drawn in the accent colour. */
  headline: [string, string];
  /** Catalogue photo ID shown behind the UI. */
  photo: string;
  /** Saved to `backgroundSettings` in sync. Empty: all themes. */
  themes?: string[];
  /** Brings the loaded new tab into the state to capture, one named stage at a time. */
  setup?: (page: Page, stage: Stage) => Promise<void>;
};

/** Mountain photos (catalogue IDs) for the My photos scene, downloaded by setup. */
export const LOCAL_PHOTOS = [
  "sies-kranen-j0ozqilkh6a-unsplash",
  "marek-piwnicki-ouvfhn5bu-unsplash",
  "radomir-moysia-0242bbkiftc-unsplash",
  "boris-baldinger-euffy6cwjsu-unsplash",
  "benjamin-voros-phifdc6la4e-unsplash",
  "sam-ferrara-1527pjeb6jg-unsplash",
  "kalen-emsley-bkci-8qcdvq-unsplash",
  "luca-micheli-ruwkmt3nu58-unsplash",
  "john-towner-jgoerugd-y4-unsplash",
  "sven-pieren-ibikgdapcp4-unsplash",
];

export const scenes: Scene[] = [
  {
    id: "hero",
    headline: ["A beautiful new tab", "that stays out of your way."],
    photo: "giuseppe-mondi-k0vluatuq9o-unsplash",
  },
  {
    id: "picker",
    headline: ["A new photo every day,", "from the themes you love."],
    photo: "daniel-leone-g30p1zcozxo-unsplash",
    themes: ["mountains", "holland", "flower-power"],
    setup: async (page, stage) => {
      await stage("opening the picker", async () => {
        await page.keyboard.press("b");
        await page.getByRole("dialog", { name: "Backgrounds" }).waitFor();
      });
      await stage("loading the theme covers", () => waitForImages(page));
    },
  },
  {
    id: "photos",
    headline: ["Or bring your own.", "Your photos, mixed right in."],
    photo: "gantavya-bhatt-mmcsajrrucm-unsplash",
    setup: async (page, stage) => {
      await stage("opening My photos", async () => {
        await page.keyboard.press("b");
        await page.getByRole("button", { name: "Add your own photos" }).click();
        await page.getByRole("dialog", { name: "My photos" }).waitFor();
      });
      await stage(
        `adding ${LOCAL_PHOTOS.length} photos`,
        () => addLocalPhotos(page, LOCAL_PHOTOS),
        90_000,
      );
      await stage("loading the thumbnails", () => waitForImages(page));
    },
  },
  {
    id: "weather",
    headline: ["Plan your day", "with a 3-day forecast."],
    photo: "mads-schmidt-rasmussen-xfngap-dtoe-unsplash",
    setup: async (page, stage) => {
      await stage("opening the forecast", async () => {
        await page.getByRole("button", { name: /°C/ }).last().click();
        await page.locator(".recharts-surface").first().waitFor();
      });
    },
  },
  {
    id: "sidebar",
    headline: ["Your links and bookmarks,", "one click away."],
    photo: "marco-pregnolato-ahyx46whd8s-unsplash",
    setup: async (page, stage) => {
      await stage("opening the sidebar", async () => {
        await page.keyboard.press("\\");
        await page.getByText("Hacker News").first().waitFor();
      });
      await stage("loading the favicons", () => waitForImages(page));
    },
  },
];

/** Every catalogue photo the scenes use, for setup to check and download. */
export const scenePhotos = () => [
  ...new Set([...scenes.map((scene) => scene.photo), ...LOCAL_PHOTOS]),
];
