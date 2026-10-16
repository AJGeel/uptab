import { resolve } from "path";

import jwt from "jsonwebtoken";

import { StoreStatus } from "./types";
import { DIST_DIR, ensureOk, log, read, requireEnv, run } from "./utils";

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
  const token = jwt.sign({ jti: crypto.randomUUID() }, env.FIREFOX_JWT_SECRET, {
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

  const { results }: { results: AmoVersion[] } = await response.json();
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
  const sourceArchive = await createSourceArchive();

  log.info("Uploading package and source code...");
  await run(
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

  log.success("Firefox: submitted for review");
};
