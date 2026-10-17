import { resolve } from "path";

import { sign } from "jsonwebtoken";

import { StoreStatus } from "./types";
import { runTask, step } from "./ui";
import { DIST_DIR, ensureOk, read, requireEnv } from "./utils";

// API reference: https://addons-server.readthedocs.io/en/latest/topics/api/

const API_URL = "https://addons.mozilla.org/api/v5";

type AmoVersion = {
  version: string;
  file: { status: string };
};

const getEnv = () =>
  requireEnv(
    "FIREFOX_EXTENSION_ID",
    "FIREFOX_JWT_ISSUER",
    "FIREFOX_JWT_SECRET",
  );

const getAuthHeader = () => {
  const env = getEnv();
  const token = sign({ jti: crypto.randomUUID() }, env.FIREFOX_JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "1m",
    issuer: env.FIREFOX_JWT_ISSUER,
  });

  return { Authorization: `JWT ${token}` };
};

export const getFirefoxStatus = async (): Promise<StoreStatus> => {
  const addonId = encodeURIComponent(getEnv().FIREFOX_EXTENSION_ID);
  const response = await fetch(
    `${API_URL}/addons/addon/${addonId}/versions/?filter=all_with_unlisted&page_size=10`,
    { headers: getAuthHeader() },
  );

  await ensureOk(response, "Firefox status check");

  const { results } = (await response.json()) as { results: AmoVersion[] };
  const [latest] = results;

  return {
    live: results.find((version) => version.file.status === "public")?.version,
    pending:
      latest && latest.file.status !== "public"
        ? { version: latest.version, state: latest.file.status }
        : undefined,
  };
};

/** Zips the committed source code, which AMO requires for minified builds. */
const createSourceArchive = async () => {
  const archivePath = resolve(DIST_DIR, "source.zip");

  await read(["git", "archive", "--format=zip", "-o", archivePath, "HEAD"]);

  return archivePath;
};

/** Uploads the build and source code, then leaves it in AMO's review queue. */
export const submitToFirefox = async (sourceDir: string) => {
  const env = getEnv();
  const sourceArchive = await step(
    "Zipping source code for reviewers",
    createSourceArchive,
    "Source code zipped",
  );

  await runTask(
    "Uploading package and source code",
    [
      "bunx",
      "web-ext",
      "sign",
      "--source-dir",
      sourceDir,
      "--artifacts-dir",
      resolve(DIST_DIR, "web-ext-artifacts"),
      "--channel",
      "listed",
      "--upload-source-code",
      sourceArchive,
      // Return once submitted instead of waiting for a human review.
      "--approval-timeout",
      "0",
    ],
    // Passed as env vars so the secret doesn't show up in the process list.
    {
      WEB_EXT_API_KEY: env.FIREFOX_JWT_ISSUER,
      WEB_EXT_API_SECRET: env.FIREFOX_JWT_SECRET,
    },
  );
};
