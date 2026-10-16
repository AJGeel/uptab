import { StoreStatus } from "./types";
import { ensureOk, log, requireEnv, sleep } from "./utils";

// API reference: https://developer.chrome.com/docs/webstore/api

const API_URL = "https://chromewebstore.googleapis.com";
export const TOKEN_URL = "https://oauth2.googleapis.com/token";
export const SCOPE = "https://www.googleapis.com/auth/chromewebstore";

const UPLOAD_POLL_INTERVAL_MS = 3000;
const UPLOAD_POLL_ATTEMPTS = 40;

type RevisionStatus = {
  state: string;
  distributionChannels?: { crxVersion: string; deployPercentage: number }[];
};

type ItemStatus = {
  publishedItemRevisionStatus?: RevisionStatus;
  submittedItemRevisionStatus?: RevisionStatus;
  lastAsyncUploadState?: string;
};

const getEnv = () =>
  requireEnv(
    "CHROME_PUBLISHER_ID",
    "CHROME_EXTENSION_ID",
    "CHROME_CLIENT_ID",
    "CHROME_CLIENT_SECRET",
    "CHROME_REFRESH_TOKEN",
  );

const getItemName = () => {
  const env = getEnv();

  return `publishers/${env.CHROME_PUBLISHER_ID}/items/${env.CHROME_EXTENSION_ID}`;
};

/** Exchanges the OAuth refresh token (see `bun store:auth`) for an access token. */
const getAccessToken = async () => {
  const env = getEnv();
  const response = await fetch(TOKEN_URL, {
    body: new URLSearchParams({
      client_id: env.CHROME_CLIENT_ID,
      client_secret: env.CHROME_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: env.CHROME_REFRESH_TOKEN,
    }),
    method: "POST",
  });

  if (response.status === 400 || response.status === 401) {
    throw new Error(
      `Chrome refresh token was rejected: ${await response.text()}\nRun "bun store:auth" to get a new one.`,
    );
  }

  await ensureOk(response, "Chrome authentication");

  const { access_token: accessToken } = await response.json();

  return accessToken as string;
};

const request = async (
  token: string,
  url: string,
  action: string,
  init: RequestInit = {},
) => {
  const response = await fetch(url, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${token}` },
  });

  await ensureOk(response, action);

  return response.json();
};

const fetchItemStatus = (token: string): Promise<ItemStatus> =>
  request(
    token,
    `${API_URL}/v2/${getItemName()}:fetchStatus`,
    "Chrome status check",
  );

const getVersion = (revision?: RevisionStatus) =>
  revision?.distributionChannels?.[0]?.crxVersion;

export const getChromeStatus = async (): Promise<StoreStatus> => {
  const status = await fetchItemStatus(await getAccessToken());
  const submitted = status.submittedItemRevisionStatus;
  const submittedVersion = getVersion(submitted);

  return {
    live: getVersion(status.publishedItemRevisionStatus),
    pending:
      submitted && submittedVersion
        ? { version: submittedVersion, state: submitted.state }
        : undefined,
  };
};

const waitForUpload = async (token: string) => {
  for (let attempt = 0; attempt < UPLOAD_POLL_ATTEMPTS; attempt++) {
    await sleep(UPLOAD_POLL_INTERVAL_MS);

    const { lastAsyncUploadState } = await fetchItemStatus(token);

    if (lastAsyncUploadState === "SUCCEEDED") {
      return;
    }

    if (lastAsyncUploadState !== "IN_PROGRESS") {
      throw new Error(`Chrome upload ended with: ${lastAsyncUploadState}`);
    }
  }

  throw new Error("Chrome upload is still processing. Check the dashboard.");
};

/** Uploads the zip, then submits it for review. It goes live once approved. */
export const submitToChrome = async (zipPath: string) => {
  const token = await getAccessToken();

  log.info("Uploading package...");
  const upload = await request(
    token,
    `${API_URL}/upload/v2/${getItemName()}:upload`,
    "Chrome upload",
    { body: Bun.file(zipPath), method: "POST" },
  );

  if (upload.uploadState !== "SUCCEEDED") {
    log.info("Upload is processing...");
    await waitForUpload(token);
  }

  log.info("Submitting for review...");
  const result = await request(
    token,
    `${API_URL}/v2/${getItemName()}:publish`,
    "Chrome publish",
    {
      body: JSON.stringify({ publishType: "DEFAULT_PUBLISH" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    },
  );

  for (const warning of result.warningInfo?.warnings ?? []) {
    log.warn(`${warning.reason}: ${warning.description}`);
  }

  log.success(`Chrome: submitted (${result.state})`);
};
