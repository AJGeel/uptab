# Remote backgrounds: extension plan

Implements [remote-backgrounds.md](remote-backgrounds.md) §4 in UpTab 2.0.0. The website side is live: `https://uptab.vercel.app/backgrounds/v1/catalogue.json` passes the §5 checks.

Follows this repo's conventions: `services/<area>/`, `hooks/queries/use*.ts`, tests next to files.

## Decisions

- **Catalogue storage:** keep the last good catalogue in `storage.local` (`backgroundCatalogue`), not in `PERSISTED_QUERIES`, whose 3-minute `maxAge` and per-version buster rule out first paint and offline use. Render from the saved copy at once, refresh in the background, and never swap the photo mid-tab.
- **Daily pick:** store `{ date, imageId }`, replacing `random-bg-offset`. Each photo is scored by hashing the date with its ID, and the highest score wins. The pick doesn't depend on list order, so devices with slightly different photos (local ones, an older catalogue) agree whenever they share the winner. Arrow keys browse for the rest of the day.
- **Themes setting:** `backgrounds.themes: string[]`, default `[]`, meaning every theme, including ones added later. Theme IDs missing from the catalogue are ignored; if nothing valid remains, every theme is used.
- **Sync:** the themes setting (`backgroundSettings`) and the daily pick (`dailyBackground`) live in `storage.sync`, so they follow the user to their other browsers of the same kind. Everything else, including local photos, stays on the device. Sync allows about 120 writes a minute in Chrome, so settings are only written when they change.
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
- `getSettings`: give `deepmerge` an overwrite `arrayMerge`, since the default concatenates saved arrays onto the defaults. It reads `backgrounds` from `storage.sync`, falling back to the local copy older builds saved; `editSettings` writes it back to sync.
- A "Backgrounds" section in the settings modal, built from the catalogue (`settingsRows` only covers boolean toggles). Show names and photo counts, not image thumbnails.

→ verify: a test that saved `["safari"]` merges to `["safari"]`, and that the synced value wins over the local one.

## 4. Fallback and cleanup

- One small built-in WebP for the first run, offline use, and when the site is unreachable.
- Delete `public/images/backgrounds/` (24 MB) and `useRandomBackground/backgrounds.ts`. The store-listing screenshots now live in `docs/store-listing/`, outside the package.

→ verify: nothing references the old paths; the zipped builds shrink accordingly.

## 5. Backgrounds picker

Making the feature visible, instead of three levels deep in Edit Preferences.

- **On the homescreen:** the photo credit (bottom left) is now a pill with the credit plus `‹ ›` (browse, like the arrow keys) and a "Backgrounds" button. It shows even when the credit is turned off, so the entry point never disappears.
- **Picker** (`components/Modals/BackgroundsModal/`): a card per theme with name, photo count and a check mark. Cards show a 2×2 mosaic of the theme's cover thumbnails (`coverImageIds`, topped up with its other photos when there are fewer than 4), with each photo's colour behind its thumbnail while it loads ([remote-backgrounds.md](remote-backgrounds.md) §7). "All themes" saves `[]`, so later themes are included too. The last selected theme can't be turned off: clicking it shakes the card and says "Keep one theme on". Changes show behind the modal straight away. The subtitle links to all photos on the website, and the footer has "Check for new photos", which refetches the catalogue bypassing the HTTP cache and reports what it found.
- **Hotkey:** `B` opens and closes the picker, and is listed in the hotkeys modal.
- **Settings:** the Backgrounds tab is a single "Choose backgrounds" button that opens the picker.
- **2.0 notice:** for 2.0.x, the update notification says "New: choose your own backgrounds!" and opens the picker (closing the sidebar) instead of the changelog.
- **Modals:** they now close on outside clicks (`onPointerDownOutside`) instead of any outside interaction, so focus left in a modal that's animating out doesn't close the next one. The title and the `footer` slot stay in view; only the part between them scrolls.

## 7. My photos

Users can add photos from their computer, mixed in with the curated themes.

- **Storage** (`services/backgrounds/localPhotos.ts`): IndexedDB (`localPhotos`). On import, each photo is scaled to at most 3840 px as WebP, with a 240 px thumbnail and its average colour. Files already added (same name, size and date) are skipped, so adding a folder again only adds its new photos. The `unlimitedStorage` permission keeps the database from being evicted when the disk fills up; neither browser shows a warning for it.
- **Mixing** (`withLocalPhotos.ts`): local photos join the catalogue as the `local` theme, listed first, so picking, browsing and the themes setting treat them like any other theme. They work without a catalogue, and show no credit.
- **Picker:** an "Add your own photos" card until there are photos, then a "My photos" theme card with a "Manage" button.
- **Manager** (`components/Modals/LocalPhotosModal/`): drop photos, or choose files or a folder, with a progress bar while adding. Click photos to select them, then remove them; "Remove all" asks for a second click. Adding the first photos turns on `local` if the user picked specific themes.

→ verify: tests for `withLocalPhotos` (mixing, no catalogue, fallback once local photos are gone).

## 6. Checks before release

- Chrome and Firefox: the catalogue and images load without adding host permissions. A new one would disable UpTab on update until each user approves it.
- DevTools offline: the saved catalogue and cached photos keep working; a first run offline shows the fallback.
- A stored image ID that's no longer in the catalogue: a new photo is picked, without errors.
- Bump to 2.0.0 and update `CHANGELOG.md`.

## Decided

- **Domain:** `uptab.vercel.app` for now. A new domain later needs an extension update; until users have updated, older versions fall back to their saved catalogue, so keeping `uptab.vercel.app` up for a while is kinder but not required.
- **New themes:** on for users with all themes selected (the default), off for users who picked specific themes.

Out of scope: syncing local photos, and watching a folder for new photos. Firefox doesn't support the File System Access API, and Chrome asks for permission again in most sessions.
