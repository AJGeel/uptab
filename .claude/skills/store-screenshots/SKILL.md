---
name: store-screenshots
description: Generate and review UpTab's Chrome Web Store / Firefox Add-ons listing screenshots with `bun store:shots`. Use when asked to (re)make, update or tweak the store screenshots, their headlines, photos or frame.
---

# Store screenshots

The screenshots are rendered from the real extension by `dev/commands/screenshots.ts`:

- `dev/screenshots/scenes.ts` lists the scenes: headline, background photo and setup steps.
- `dev/screenshots/fixtures.ts` fixes the time (Saturday 20 June 2026, 16:20, Amsterdam) and the weather (sunny, 25 °C).
- `dev/screenshots/frame.html` is the template around each capture: headline, browser window and faint photo backdrop.

Output: `docs/store-listing/screenshots/1.jpg`…`5.jpg` (1280×800, the size Chrome requires). Raw captures go to `dist/screenshots/raw/`.

## Steps

1. Make sure the local uptab-website is running if `.env` sets `VITE_CATALOGUE_URL` to localhost. Setup fails fast with a clear message if it isn't.
2. Run `bun store:shots:setup` after changing extension code, the catalogue URL, or the My photos sample list.
3. Run `bun store:shots --only <scene>` while iterating on one scene, and `bun store:shots` for the full set (about 20 s).
   - Redirect the output to a log file and read it afterwards; don't pipe it through `grep`, which hides progress until the end.
   - Every stage has a deadline (30 s by default). If one times out, the error names the stage: fix the cause, don't just raise the timeout.
4. Read every output JPG and check:
   - no spinners, "Checking the weather…", update notices, focus rings or hover states;
   - 25°C, Sunny, "Saturday, 20th Jun 2026" in the top bar;
   - the headline fits on its two lines and doesn't collide with the window;
   - the UI is readable over the photo, and the photo suits the scene;
   - the modal or sidebar the scene is about is fully in view.
5. Fix issues in the scene config or the template, rerun only the affected scenes, and look again.
6. Report what changed, with the image paths. Never upload: listing images are updated by hand in the Chrome dashboard and on AMO.

## Gotchas

- The photo IDs in `scenes.ts` must exist in the catalogue; setup checks them.
- Runs are reproducible: icons are cached in `dist/screenshots/favicons/`, and bookmarks are created a few milliseconds apart so their order is stable. If two runs differ, find the source of the randomness rather than accepting it.
