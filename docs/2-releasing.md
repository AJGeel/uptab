# Releasing <a name="releasing"></a>

UpTab is submitted to the Chrome Web Store and Firefox Add-ons with one script:

```sh
bun store:status            # versions live and pending in each store
bun store:submit --dry-run  # all checks and a build, without uploading
bun store:submit            # build and submit to both stores
bun store:submit firefox    # or only one store: chrome / firefox
```

`store:submit` stops before uploading anything if:

- there are uncommitted changes, so the build and the Firefox source upload match a commit,
- a store already has the `version` from `package.json` (live or in review),
- a built manifest has the wrong version or is meant for the other browser.

After submitting, both stores review the update. Chrome publishes it automatically once approved. Firefox does the same for listed add-ons.

<br/>

## 1. Release checklist

1. Bump `version` in `package.json`.
2. Add the release to `CHANGELOG.md`.
3. Commit, then run `bun store:submit --dry-run`.
4. Run `bun store:submit`.
5. Check `bun store:status` in the following days.
6. Once the release PR is merged, check out an up-to-date `main` and run `bun tag-release`.

If one store fails, fix the problem and rerun for that store only, e.g. `bun store:submit chrome`. The version check stops a store from receiving the same version twice.

`bun tag-release` tags the commit as `V<version>` (e.g. `V1.5.0`), pushes the tag, and creates a GitHub release with that version's `CHANGELOG.md` section as its notes. Run `bun tag-release --dry-run` first to preview the tag and notes. It stops if you're not on `main`, there are uncommitted changes, `main` differs from `origin/main`, the tag already exists, or the changelog has no section for the version.

### Store screenshots

The listing screenshots in `docs/store-listing/screenshots/` are rendered from the real extension, with a fixed date, time and weather:

```sh
bunx playwright install chromium   # once
bun store:shots:setup              # check the catalogue, build, download sample photos
bun store:shots                    # capture and frame all scenes (~20 s)
bun store:shots --only picker      # one scene
bun store:shots:upload --dry-run   # show what the upload would change
bun store:shots:upload             # replace the Firefox screenshots, then open the Chrome dashboard
```

Scenes, headlines and photos live in `dev/screenshots/scenes.ts`, and the frame in `dev/screenshots/frame.html`. Photos come from the catalogue in `VITE_CATALOGUE_URL`, so a local uptab-website must be running if that points to localhost. In Claude Code, the `store-screenshots` skill runs this and reviews the results.

`store:shots:upload` replaces the Firefox listing's screenshots through AMO's API, captioned with their headlines, using the `FIREFOX_*` credentials below. It adds the new ones before removing the old ones. Chrome's API can't change listing images, so it then opens the dashboard and the screenshots folder: under **Store listing**, swap the screenshots by hand and save.

<br/>

## 2. One-time setup

Copy `.env.example` to `.env` and fill in the values below.

### 2.1 Chrome Web Store

The script uses the [Chrome Web Store API V2](https://developer.chrome.com/docs/webstore/api) with an OAuth refresh token.

The OAuth client can live in any Google Cloud project, such as a free personal one. The account you sign in with in step 4 is the one the script acts as, so that must be the account that owns the Chrome Web Store listing.

1. In the [Google Cloud Console](https://console.cloud.google.com/), create or select a project and enable the **Chrome Web Store API**.
2. Under **Google Auth Platform**, set up the consent screen with user type **External**. Then, under **Audience**, click **Publish app** so its status is **In production**. While it's in **Testing**, refresh tokens expire after 7 days.
3. Under **Clients**, create an OAuth client of type **Desktop app**, and copy its ID and secret to `.env`.
4. Run `bun store:auth` and sign in. Google warns that the app isn't verified: choose **Advanced > Go to (app name)**. The refresh token is saved to `.env`.
5. In the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/), go to **Publisher > Settings** and copy the publisher ID.

```sh
CHROME_PUBLISHER_ID=<publisher ID>
CHROME_EXTENSION_ID=dapdeiobfagcbhcpeijbhhlggopmjnlf
CHROME_CLIENT_ID=<client ID>
CHROME_CLIENT_SECRET=<client secret>
CHROME_REFRESH_TOKEN=<set by bun store:auth>
```

Check it with `bun store:status chrome`. If the token stops working, run `bun store:auth` again.

### 2.2 Firefox Add-ons

The script uses [`web-ext sign`](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/#web-ext-sign) to submit a new listed version. It also uploads the committed source code (`git archive HEAD`), which AMO requires for minified builds.

1. Generate API credentials at [addons.mozilla.org/developers/addon/api/key](https://addons.mozilla.org/en-US/developers/addon/api/key/).

```sh
FIREFOX_EXTENSION_ID=ageel@enrise.com
FIREFOX_JWT_ISSUER=<JWT issuer>
FIREFOX_JWT_SECRET=<JWT secret>
```

Check it with `bun store:status firefox`.

> AMO reviewers rebuild the extension from the source upload. `VITE_GLITCHTIP_DSN` from `.env` isn't in it, so if a reviewer asks about the difference, explain that it's the error reporting DSN, inlined in the submitted bundle.
