/**
 * Submits UpTab to the Chrome Web Store and Firefox Add-ons.
 *
 * Usage:
 *   bun store:status [chrome|firefox]
 *   bun store:submit [chrome|firefox] [--dry-run]
 *
 * Without a store argument, both stores are used. See docs/2-releasing.md.
 */
import { readFileSync } from "fs";
import { resolve } from "path";

import { getChromeStatus, submitToChrome } from "./chrome";
import { getFirefoxStatus, submitToFirefox } from "./firefox";
import { StoreStatus } from "./types";
import { DIST_DIR, ROOT_DIR, compareVersions, log, read, run } from "./utils";

type Store = {
  name: string;
  buildDir: string;
  getStatus: () => Promise<StoreStatus>;
  submit: () => Promise<void>;
  /** Checks the built manifest is the one meant for this store. */
  isExpectedManifest: (manifest: Manifest) => boolean;
};

type Manifest = {
  version: string;
  browser_specific_settings?: { gecko?: { id?: string } };
};

/** A pending submission in one of these states doesn't block a resubmit. */
const RETRYABLE_STATES = ["REJECTED", "CANCELLED", "disabled"];

const STORES: Record<string, Store> = {
  chrome: {
    name: "Chrome",
    buildDir: resolve(DIST_DIR, "chromium"),
    getStatus: getChromeStatus,
    submit: () => submitToChrome(resolve(DIST_DIR, "chromium.zip")),
    isExpectedManifest: (manifest) => !manifest.browser_specific_settings,
  },
  firefox: {
    name: "Firefox",
    buildDir: resolve(DIST_DIR, "firefox"),
    getStatus: getFirefoxStatus,
    submit: () => submitToFirefox(resolve(DIST_DIR, "firefox")),
    isExpectedManifest: (manifest) =>
      Boolean(manifest.browser_specific_settings?.gecko?.id),
  },
};

const readJson = <T>(path: string): T => JSON.parse(readFileSync(path, "utf8"));

const describeStatus = ({ live, pending }: StoreStatus) =>
  [
    `live ${live ?? "none"}`,
    pending ? `pending ${pending.version} (${pending.state})` : undefined,
  ]
    .filter(Boolean)
    .join(", ");

/** Throws unless `version` is newer than everything the store already has. */
const assertNewVersion = (
  store: Store,
  version: string,
  status: StoreStatus,
) => {
  const blockingPending =
    status.pending && !RETRYABLE_STATES.includes(status.pending.state)
      ? status.pending.version
      : undefined;

  for (const existing of [status.live, blockingPending]) {
    if (existing && compareVersions(version, existing) <= 0) {
      throw new Error(
        `${store.name} already has ${existing}. Bump "version" in package.json.`,
      );
    }
  }
};

const assertCleanWorkingTree = async () => {
  if (await read(["git", "status", "--porcelain"])) {
    throw new Error(
      "Commit or stash your changes first, so the build and source upload match a commit.",
    );
  }
};

const assertBuild = (store: Store, version: string) => {
  const manifest = readJson<Manifest>(resolve(store.buildDir, "manifest.json"));

  if (manifest.version !== version) {
    throw new Error(
      `${store.name} build has version ${manifest.version}, expected ${version}.`,
    );
  }

  if (!store.isExpectedManifest(manifest)) {
    throw new Error(`${store.name} build has the wrong manifest.`);
  }
};

const status = async (stores: Store[]) => {
  for (const store of stores) {
    log.info(`${store.name}: ${describeStatus(await store.getStatus())}`);
  }
};

const submit = async (stores: Store[], isDryRun: boolean) => {
  const { version } = readJson<{ version: string }>(
    resolve(ROOT_DIR, "package.json"),
  );

  log.step(`Checking stores for version ${version}`);
  await assertCleanWorkingTree();

  for (const store of stores) {
    const storeStatus = await store.getStatus();

    log.info(`${store.name}: ${describeStatus(storeStatus)}`);
    assertNewVersion(store, version, storeStatus);
  }

  log.step("Building");
  await run(["bun", "run", "ship"]);
  stores.forEach((store) => assertBuild(store, version));

  if (isDryRun) {
    log.success(`Dry run passed. Ready to submit ${version}.`);
    return;
  }

  for (const store of stores) {
    log.step(`Submitting ${version} to ${store.name}`);
    await store.submit();
  }
};

const main = async () => {
  const [command, ...rest] = process.argv.slice(2);
  const isDryRun = rest.includes("--dry-run");
  const names = rest.filter((arg) => !arg.startsWith("--"));
  const unknown = names.filter((name) => !STORES[name]);

  if (unknown.length > 0) {
    throw new Error(
      `Unknown store: ${unknown.join(", ")}. Use chrome or firefox.`,
    );
  }

  const stores = (names.length > 0 ? names : Object.keys(STORES)).map(
    (name) => STORES[name],
  );

  switch (command) {
    case "status":
      return await status(stores);
    case "submit":
      return await submit(stores, isDryRun);
    default:
      throw new Error("Usage: bun store:status | bun store:submit [--dry-run]");
  }
};

main().catch((error: Error) => {
  log.error(error.message);
  process.exit(1);
});
