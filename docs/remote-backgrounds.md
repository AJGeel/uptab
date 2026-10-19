# Remote backgrounds (v1)

Spec for serving UpTab's new-tab backgrounds from the `uptab-website` Next.js project instead of shipping them inside the extension. Planned for UpTab 2.0.0.

The extension currently bundles 17 photos (24 MB, camera originals up to 5472×3648). The website serves the photos and a catalogue as **static files on Vercel's CDN**: no API route runs per new tab, and nothing needs an API key.

**Build the website side first.** The extension work starts once the [checks](#5-checks) pass against the deployed site.

---

## 1. Contract

This section is what the extension relies on. Breaking changes are allowed when they're worth it; the rules below make sure older extensions degrade gracefully instead of breaking.

### URLs

| What      | URL                                                                |
| --------- | ------------------------------------------------------------------ |
| Catalogue | `https://<domain>/backgrounds/v1/catalogue.json`                   |
| Image     | `https://<domain>/backgrounds/v1/<theme>/<id>-<width>-<hash>.webp` |

- `<domain>` is still to be decided (see [open decisions](#6-open-decisions)). It must stay the same for as long as any extension version that uses it is installed.
- The extension builds no image URLs itself. It only uses the URLs listed in the catalogue, so the image layout can change freely.

### Catalogue schema

```ts
type Catalogue = {
  version: 1;
  /** ISO timestamp of the build that generated this file. */
  generatedAt: string;
  themes: Theme[];
  images: BackgroundImage[];
};

type Theme = {
  /** Slug, e.g. "holland". Stored in users' settings: renaming one resets those users to the default theme. */
  id: string;
  /** Display name, e.g. "Holland". */
  name: string;
  /**
   * Optional: up to 4 image IDs that represent the theme, in order. Missing,
   * or IDs not in the catalogue: use the theme's first images.
   */
  coverImageIds?: string[];
};

type BackgroundImage = {
  /** Stable slug, unique across all themes, e.g. "koppelpoort". */
  id: string;
  /** A Theme.id. */
  theme: string;
  /** Photographer, shown as "Photo by …". null hides the credit. */
  author: string | null;
  /** Optional link for the credit, e.g. an Unsplash page. */
  link: string | null;
  /** Dominant colour as "#rrggbb", shown while the image loads. */
  color: string;
  /** Original aspect ratio, width / height (e.g. 1.5). */
  aspectRatio: number;
  /**
   * Available renditions, smallest first. Widths are never larger than the
   * source (no upscaling), so a small source may only have 1920.
   */
  sources: { width: number; url: string }[];
  /** Optional: a 240 px preview for the theme picker. Never a background, so not in `sources`. */
  thumbnail?: { width: number; url: string };
};
```

Example:

```json
{
  "version": 1,
  "generatedAt": "2026-10-20T12:00:00.000Z",
  "themes": [{ "id": "holland", "name": "Holland" }],
  "images": [
    {
      "id": "koppelpoort",
      "theme": "holland",
      "author": "Denise Jans",
      "link": null,
      "color": "#6b7f94",
      "aspectRatio": 1.5,
      "sources": [
        {
          "width": 1920,
          "url": "https://<domain>/backgrounds/v1/holland/koppelpoort-1920-3fa9c2.webp"
        },
        {
          "width": 2560,
          "url": "https://<domain>/backgrounds/v1/holland/koppelpoort-2560-81d0e4.webp"
        },
        {
          "width": 3840,
          "url": "https://<domain>/backgrounds/v1/holland/koppelpoort-3840-c27b19.webp"
        }
      ]
    }
  ]
}
```

### Rules for v1

- **Prefer additive changes.** New optional fields, themes and images never affect existing extensions.
- **Images and themes come and go.** An image can be removed from `images`, or renamed, which counts as removing it and adding a new one. The extension copes with a stored image or theme ID that's no longer in the catalogue, by picking another image or falling back to the default theme.
- **Image files are immutable.** `<hash>` comes from the file's contents, so a re-encoded photo gets a new URL. Never overwrite a file at an existing URL: it's cached for a year, so users would keep the old photo.
- **Breaking changes are allowed.** Removing or renaming a field, or renaming a theme ID, is fine. For a change to the catalogue's shape, bump `version`: extensions that don't recognise it keep using their saved catalogue, or the built-in photo. Keeping the old catalogue served for a while is nice for users on older versions, but not required.
- URLs in `sources` are absolute, so the extension never needs to know the domain.

### Response headers

| Path                             | `Cache-Control`                                      | `Access-Control-Allow-Origin` |
| -------------------------------- | ---------------------------------------------------- | ----------------------------- |
| `/backgrounds/v1/catalogue.json` | `public, max-age=3600, stale-while-revalidate=86400` | `*`                           |
| `/backgrounds/v1/*/*.webp`       | `public, max-age=31536000, immutable`                | `*`                           |

Why CORS is needed: the extension `fetch()`es the catalogue, and may fetch images too to cache them. With these headers it needs no host permission. A new host permission would make Chrome disable UpTab on update until each user approves it.

---

## 2. Implementation

### 2.1 Source photos and metadata

Move the source photos out of `public/` so the originals aren't served:

```
assets/backgrounds/
  backgrounds.json        ← hand-written metadata (below)
  holland/koppelpoort.jpg ← highest-resolution original available
  safari/…
```

`assets/backgrounds/backgrounds.json` is the only file anyone edits by hand when adding a photo. Most photos are from Unsplash, under the [Unsplash License](https://unsplash.com/license): free to use without credit, but it doesn't allow compiling images "to replicate a similar or competing service". The others are used with the photographer's permission. Credits are a courtesy, not a licence requirement. Unsplash photos are downloaded by hand: the Unsplash API can't be used, because its guidelines rule out wallpaper apps and require hotlinking instead of rehosting.

```json
{
  "themes": [
    { "id": "holland", "name": "Holland" },
    { "id": "safari", "name": "Safari" },
    { "id": "underwater", "name": "Underwater" },
    { "id": "abstract", "name": "Abstract" }
  ],
  "images": [
    {
      "id": "koppelpoort",
      "theme": "holland",
      "file": "holland/koppelpoort.jpg",
      "author": "Denise Jans",
      "link": null
    },
    {
      "id": "safari-1",
      "theme": "safari",
      "file": "safari/1.jpg",
      "author": null,
      "link": null,
      "creditPending": true
    }
  ]
}
```

`creditPending: true` keeps a photo **out of the catalogue** until its credit is sorted. The admin (2.5) sets it automatically: a photo is published when it has an author, and pending when it doesn't. While a photo is published, its `id` and theme are locked in the admin. Once it's pending again, both can change (see the rules in §1).

→ **Check:** every file in `assets/backgrounds/<theme>/` has exactly one entry, and every entry's `file` exists. The build script enforces this (2.2).

### 2.2 Build script

`scripts/build-backgrounds.ts`, run as `prebuild` (`"prebuild": "bun scripts/build-backgrounds.ts"`) so Vercel generates the output on every deploy. Uses `sharp`, which Next already installs.

For each image in `backgrounds.json` **without** `creditPending`:

1. Read the source and its dimensions.
2. For each width in `[1920, 2560, 3840]` that is **≤ the source width** (always at least one width; if the source is narrower than 1920, use its own width):
   - Resize to that width, keeping the aspect ratio.
   - Encode as WebP, quality ~80. Use `effort: 6` to keep files small at the cost of build time.
   - Hash the output bytes (first 6 hex characters of a SHA-256) and write `public/backgrounds/v1/<theme>/<id>-<width>-<hash>.webp`.
3. Get the dominant colour with `sharp(...).stats()` → `dominant`, formatted as `#rrggbb`.
4. Add the entry to the catalogue with absolute URLs, using the site's base URL from an env var such as `NEXT_PUBLIC_SITE_URL`.

Then write `public/backgrounds/v1/catalogue.json`. Leave out any theme that has no published images, so the extension never offers an empty theme. Log the pending photos as a reminder, for example `Skipped 27 photos with creditPending: safari-1, …`.

The script should fail the build when:

- a theme ID or image ID is duplicated,
- an image refers to a theme that doesn't exist,
- a listed file is missing, or a source file has no entry,
- a published image (no `creditPending`) has no `author` key. Use `null` explicitly when no credit should be shown.

Add `public/backgrounds/v1/` to `.gitignore`, since it's generated.

→ **Check:** `bun run build` succeeds locally, prints each image's sizes in KB, and `public/backgrounds/v1/catalogue.json` matches the schema in §1. Expected size: about 150–400 KB per rendition, against about 1.5 MB per 1920 px JPEG today.

### 2.3 Headers

In `next.config.mjs`:

```js
const nextConfig = {
  async headers() {
    const cors = { key: "Access-Control-Allow-Origin", value: "*" };

    return [
      {
        source: "/backgrounds/v1/catalogue.json",
        headers: [
          cors,
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // Two path segments, so this never matches catalogue.json.
        source: "/backgrounds/v1/:theme/:file",
        headers: [
          cors,
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};
```

→ **Check:** the `curl -I` commands in §5 show both headers on the deployed site.

### 2.4 Existing gallery and API routes

- `src/app/backgrounds/page.tsx` (the public gallery) currently reads `public/backgrounds/<theme>/` with `getAllBackgrounds()`, and links each theme to `/api/background?theme=…`. Switch it to read the generated `catalogue.json` (or `backgrounds.json`). Show the 1920 renditions with credits, and link to the 3840 rendition instead of the API route.
- `/api/background` and `/api/backgrounds` (with the `UPTAB_API_KEY` check) aren't needed by the extension anymore. Remove them, and `UPTAB_API_KEY` from `.env.example`, once the gallery no longer links to them.
- Delete the old JPEGs in `public/backgrounds/<theme>/` after they've moved to `assets/backgrounds/`.

→ **Check:** `/backgrounds` renders every photo with its credit, and no code still references `/api/background` or `public/backgrounds/<theme>`.

### 2.5 Admin

A local-only admin at `/admin` manages `assets/backgrounds/` and `backgrounds.json`. Its files are named `page.dev.tsx` and `route.dev.ts`, which only `next dev` treats as routes, so it doesn't exist in production builds. It answers requests to localhost only.

- **Themes:** create one, and rename its display name or ID. Renaming an ID resets users who had it enabled to the default theme.
- **Photos:** upload into a theme; edit ID, theme, author and link; remove. A photo is published as soon as it has an author. Clearing the author takes it out of the catalogue. Invalid values, such as a bad link or a duplicate ID, refuse the save instead.
- **Find source:** for pending photos, reverse image search links (Google Lens, TinEye) using the photo's URL on the live site, or a download of the original to search by hand.
- **Rebuild:** runs the build script and shows its log.

→ **Check:** `bun run build` lists no `/admin` route, and `/admin` returns 404 under `next start`.

---

## 3. Photo migration

The extension and the website overlap: 11 of the website's 12 `holland` photos are byte-identical copies of extension photos. The website's copies are 1920×1080, while the extension has the camera originals. **Use the extension's originals as the sources** (from `uptab/public/images/backgrounds/`), so the 2560 and 3840 renditions can be produced.

| Proposed ID                           | Extension file (source)                  | Website copy                   | Author               | Link                                                                                       |
| ------------------------------------- | ---------------------------------------- | ------------------------------ | -------------------- | ------------------------------------------------------------------------------------------ |
| `body-of-water-beside-wind-mills`     | body-of-water-beside-wind-mills.jpg      | holland/2.jpg                  | Vishwas Katti        | https://unsplash.com/photos/body-of-water-beside-green-trees-and-wind-mills-x2XDMf-rirc    |
| `white-sheep-on-green-grass-field`    | white-sheep-on-green-grass-field.jpg     | holland/10.jpg                 | Kwakus               | https://unsplash.com/photos/white-sheep-on-green-grass-field-during-daytime-yEpUny1hxoE    |
| `kubuswoningen`                       | kubuswoningen.jpg                        | holland/6.jpg                  | Nicole Baster        | https://unsplash.com/photos/yellow-and-gray-houses-_SD9XBRFig8                             |
| `green-grass-field-kinderdijk`        | green-grass-field-kinderdijk.jpg         | holland/4.jpg                  | Thomas Bormans       | https://unsplash.com/photos/green-grass-field-near-body-of-water-during-sunset-kNmlCjM3apA |
| `green-grass-field-near-sea`          | green-grass-field-near-sea.jpg           | holland/5.jpg                  | Dana Marin           | https://unsplash.com/photos/green-grass-field-near-sea-during-daytime-Sa9msnED0RA          |
| `gray-windmill`                       | gray-windmill-photo.jpg                  | holland/3.jpg                  | Peter Hall           | https://unsplash.com/photos/gray-windmill-faZ73Tck8Wc                                      |
| `field-with-house-in-the-distance`    | a-field-with-a-house-in-the-distance.jpg | —                              | Tim Cristopher Klonk | https://unsplash.com/photos/a-field-with-a-house-in-the-distance-aYxDQzYmjLQ               |
| `halve-zolenlijn`                     | halve-zolenlijn.jpg                      | holland/halve-zolenlijn.jpg    | Max Hoogenbosch      | —                                                                                          |
| `aerial-castle-view`                  | aerial-castle-view.jpg                   | holland/aerial-castle-view.jpg | Sven van W           | —                                                                                          |
| `tivoli-vredenburg`                   | tivoli-vredenburg.jpg                    | holland/tivoli-vredenburg.jpg  | Alex Lanting         | —                                                                                          |
| `white-highrise-building`             | white-highrise-building.jpg              | holland/9.jpg                  | Victor               | https://unsplash.com/photos/white-high-rise-building-at-daytime-qm9pHqVt7KA                |
| `red-flower-field-near-wind-turbines` | red-flower-field-near-wind-turbines.jpg  | holland/8.jpg                  | Martijn Baudoin      | https://unsplash.com/photos/red-flower-field-near-wind-turbines-C4rDHqqmu4w                |
| `dom-tower-utrecht`                   | the-dom-tower-in-utrecht.jpg             | —                              | Max Hoogenbosch      | —                                                                                          |
| `overdamspad-houten`                  | overdamspad-in-houten.jpg                | —                              | Max Hoogenbosch      | —                                                                                          |
| `koppelpoort`                         | koppelpoort.jpg                          | —                              | Denise Jans          | —                                                                                          |
| `amersfoort`                          | amersfoort.jpg                           | —                              | Mitchel Lensink      | —                                                                                          |
| `kunsthal-kade`                       | kunsthal-kade.jpg                        | —                              | Wood Hong            | —                                                                                          |

Credits come from `uptab/src/hooks/useRandomBackground/backgrounds.ts`.

The website-only photos are free to use, but their credits aren't known yet. Add them to `backgrounds.json` with `creditPending: true` and placeholder IDs, so they're ready to publish as soon as the credits are in:

| Placeholder IDs                  | Source (now in `public/backgrounds/`) | Count |
| -------------------------------- | ------------------------------------- | ----- |
| `holland-7`                      | holland/7.jpg                         | 1     |
| `safari-1` … `safari-10`         | safari/1–10.jpg                       | 10    |
| `underwater-1` … `underwater-10` | underwater/1–10.jpg                   | 10    |
| `abstract-1` … `abstract-6`      | abstract/1–6.jpg                      | 6     |

Give them descriptive IDs (like the holland photos) when publishing; the placeholders are fine until then.

→ **Check:** the catalogue has exactly one theme, `holland`, with the 17 extension photos, each with the credit above and renditions up to the width its original allows. The build log lists the 27 pending photos as skipped.

---

## 4. Extension side (for context)

This is implemented in the `uptab` repo after the website is live. It's listed here so the contract makes sense.

- **Catalogue:** fetched with React Query. Browser HTTP caching handles freshness, using the headers from §1.
- **Choosing a photo:** a daily pick from the enabled themes; arrow keys move to the next or previous photo. The default theme is `holland`, so existing users see the same kind of photos.
- **Rendition:** the extension picks the smallest `source` with `width ≥ screen.width × devicePixelRatio`, falling back to the largest one. `color` is the background until the image has loaded.
- **Missing images:** a stored image ID that's no longer in the catalogue is skipped, since images can be removed or renamed (§1).
- **Theme picker:** a "Backgrounds" modal with a card per theme, showing up to 4 cover thumbnails as a mosaic (§7).
- **Fallback:** one small built-in WebP for the first run, offline use, or when the site is unreachable. The 17 bundled JPEGs are removed from the extension.
- **Later in 2.0.0:** user uploads, stored in IndexedDB, appear as a "My photos" theme. They don't involve this website.

---

## 5. Checks

Run against the deployed site, with `D=https://<domain>`:

```sh
# Catalogue: 200, JSON, CORS and a one-hour cache
curl -sI "$D/backgrounds/v1/catalogue.json" | grep -iE "^(HTTP|content-type|cache-control|access-control-allow-origin)"

# Catalogue matches the schema and lists every photo
curl -s "$D/backgrounds/v1/catalogue.json" | jq '{version, themes: [.themes[].id], images: (.images | length), uncredited: [.images[] | select(.author == null) | .id]}'

# Every listed image URL resolves, with an immutable cache and CORS
curl -s "$D/backgrounds/v1/catalogue.json" | jq -r '.images[].sources[].url' | while read -r url; do
  curl -sI "$url" | awk -v u="$url" '/^HTTP/ {s=$2} tolower($0) ~ /^cache-control:.*immutable/ {c=1} tolower($0) ~ /^access-control-allow-origin: \*/ {a=1} END {if (s != 200 || !c || !a) print "FAIL", s, u}'
done
```

- The first command shows `200`, `application/json`, `max-age=3600` and `access-control-allow-origin: *`.
- The second shows `themes: ["holland"]` and `images: 17` until the pending credits are sorted.
- The loop prints nothing when every image passes.
- In the DevTools console of any other website, for example https://example.com, `await (await fetch("https://<domain>/backgrounds/v1/catalogue.json")).json()` works without a CORS error.

---

## 6. Open decisions

1. **Domain:** keep `uptab.vercel.app` or move to a custom domain? Decide before the extension ships, because the URL is built into it.
2. **Credits for the 27 pending photos:** they stay out of the catalogue until credited (see §3). The admin's "Find source" links run a reverse image search for each. Publishing them needs no extension update.

Decided:

- **Theme IDs:** `holland`, `safari`, `underwater` and `abstract` for now. They can be renamed later (see §1).
- **Widths:** up to 3840. Larger sizes, such as 5120 for 5K screens, can be added later without affecting existing extensions.

---

## 7. Thumbnails for the theme picker

The extension's theme picker shows one card per theme, about 200 × 96 px, with up to 4 photos as a mosaic.

- **Build script:** also writes a 240 px WebP per published image (`<id>-240-<hash>.webp`, the same immutable cache headers), about 5 KB each.
- **Catalogue:** `thumbnail` on each image and `coverImageIds` on each theme (§1), both optional and additive. Only published photos are listed as covers; a theme without any has no `coverImageIds`.
- **Admin:** "Add to cover" per photo on a theme's page, up to 4, in the order picked. Renaming a cover photo keeps it in the cover; moving it to another theme or removing it takes it out.

The extension shows the covers' thumbnails, topped up with the theme's other photos when there are fewer than 4. Each cell shows the photo's `color` while its thumbnail loads, or when it has no `thumbnail`. Older extensions ignore both fields.
