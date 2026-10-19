# Remote backgrounds: extension plan

Implements [remote-backgrounds.md](remote-backgrounds.md) §4 in UpTab 2.0.0. The website side is live: `https://uptab.vercel.app/backgrounds/v1/catalogue.json` passes the §5 checks.

Follows this repo's conventions: `services/<area>/`, `hooks/queries/use*.ts`, tests next to files.

## Decisions

- **Catalogue storage:** keep the last good catalogue in `storage.local` (`backgroundCatalogue`), not in `PERSISTED_QUERIES`, whose 3-minute `maxAge` and per-version buster rule out first paint and offline use. Render from the saved copy at once, refresh in the background, and never swap the photo mid-tab.
- **Daily pick:** store `{ date, imageId }`, replacing `random-bg-offset`. A new day picks a new photo, seeded by the full date (today's seed is day-of-month only). Arrow keys browse for the rest of the day.
- **Themes setting:** `backgrounds.themes: string[]`, default `["holland"]`. New themes start off. Theme IDs missing from the catalogue are ignored; if nothing valid remains, use `holland`, or else every photo.
- **Leniency:** check `version === 1` and the fields we use; ignore unknown fields, so additive changes never break the extension. An unknown `version` is a breaking change: keep using the saved catalogue, or the fallback photo.

## 1. Catalogue

- `services/backgrounds/catalogueUrl.ts`: one constant, overridable with `VITE_CATALOGUE_URL` for local testing against `http://localhost:3000`.
- `services/backgrounds/parseCatalogue.ts`: lenient parse, skipping images without sources.
- `services/backgrounds/getCatalogue.ts`: fetch with a timeout, save on success, return the saved copy on failure.
- `hooks/queries/useCatalogue.ts`: saved copy first, network refresh in the background.

→ verify: tests for `parseCatalogue` (unknown fields, wrong version, empty sources).

## 2. Picking and showing a photo

- `services/backgrounds/pickRendition.ts`: smallest width ≥ `screen.width × devicePixelRatio`, else the largest. `Background` paints a CSS background, so no `srcset`.
- `services/backgrounds/pickDailyImage.ts`: from the enabled photos, honouring a stored ID only if it still exists.
- Rewrite `useRandomBackground` on top of these; drop `random-bg-offset`.
- `Background`: show `image.color` while loading. On image error, refetch the catalogue once, bypassing the HTTP cache, then fall back to the built-in photo.
- Credit: hide when `author` is `null` (and adjust the `alt` text); link it when `link` is set.

→ verify: tests for both pickers (ties, no match, missing ID, empty list).

## 3. Theme setting

- Add `backgrounds.themes` to `Settings` and `defaultSettings`.
- `getSettings`: give `deepmerge` an overwrite `arrayMerge`, since the default concatenates arrays, so `holland` would always stay enabled.
- A "Backgrounds" section in the settings modal, built from the catalogue (`settingsRows` only covers boolean toggles). Show names and photo counts, not image thumbnails.

→ verify: a test that saved `["safari"]` merges to `["safari"]`.

## 4. Fallback and cleanup

- One small built-in WebP for the first run, offline use, and when the site is unreachable.
- Delete `public/images/backgrounds/` (24 MB) and `useRandomBackground/backgrounds.ts`. The store-listing screenshots now live in `docs/store-listing/`, outside the package.

→ verify: nothing references the old paths; the zipped builds shrink accordingly.

## 5. Backgrounds picker

Making the feature visible, instead of three levels deep in Edit Preferences.

- **On the homescreen:** the photo credit (bottom left) is now a pill with the credit plus `‹ ›` (browse, like the arrow keys) and a "Backgrounds" button. It shows even when the credit is turned off, so the entry point never disappears.
- **Picker** (`components/Modals/BackgroundsModal/`): a card per theme with name, photo count and a check mark. Cards show a 2×2 mosaic of the theme's cover thumbnails (`coverImageIds`, topped up with its other photos when there are fewer than 4), with each photo's colour behind its thumbnail while it loads ([remote-backgrounds.md](remote-backgrounds.md) §7). "All themes" selects everything; the last selected theme can't be turned off, replacing the silent fallback to Holland. Changes show behind the modal straight away.
- **Hotkey:** `B` opens and closes the picker, and is listed in the hotkeys modal.
- **Settings:** the Backgrounds tab is a single "Choose backgrounds" button that opens the picker.
- **2.0 notice:** for 2.0.x, the update notification says "New: choose your own backgrounds!" and opens the picker (closing the sidebar) instead of the changelog.
- **Modals:** they now close on outside clicks (`onPointerDownOutside`) instead of any outside interaction, so focus left in a modal that's animating out doesn't close the next one.

## 6. Checks before release

- Chrome and Firefox: the catalogue and images load without adding host permissions. A new one would disable UpTab on update until each user approves it.
- DevTools offline: the saved catalogue and cached photos keep working; a first run offline shows the fallback.
- A stored image ID that's no longer in the catalogue: a new photo is picked, without errors.
- Bump to 2.0.0 and update `CHANGELOG.md`.

## Decided

- **Domain:** `uptab.vercel.app` for now. A new domain later needs an extension update; until users have updated, older versions fall back to their saved catalogue, so keeping `uptab.vercel.app` up for a while is kinder but not required.
- **New themes:** off by default. An option to enable new themes can be added later; it needs no catalogue change.

Out of scope: user uploads ("My photos"), the later 2.0.0 item in the spec.
