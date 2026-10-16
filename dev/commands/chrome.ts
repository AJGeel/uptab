import { StoreStatus } from "./types";
import { p, pc, step } from "./ui";
import { ensureOk, requireEnv, sleep } from "./utils";

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

type UploadResponse = { uploadState: string };

type PublishResponse = {
  state: string;
  warningInfo?: { warnings: { reason: string; description: string }[] };
};

export type TokenResponse = { access_token: string; refresh_token?: string };

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

  const { access_token: accessToken } =
    (await response.json()) as TokenResponse;

  return accessToken;
};

const request = async <T>(
  token: string,
  url: string,
  action: string,
  init: RequestInit = {},
): Promise<T> => {
  const response = await fetch(url, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${token}` },
  });

  await ensureOk(response, action);

  return (await response.json()) as T;
};

const fetchItemStatus = (token: string) =>
  request<ItemStatus>(
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

const waitForUpload = async (
  token: string,
  update: (message: string) => void,
) => {
  for (let attempt = 1; attempt <= UPLOAD_POLL_ATTEMPTS; attempt++) {
    await sleep(UPLOAD_POLL_INTERVAL_MS);

    const { lastAsyncUploadState } = await fetchItemStatus(token);

    if (lastAsyncUploadState === "SUCCEEDED") {
      return;
    }

    if (lastAsyncUploadState !== "IN_PROGRESS") {
      throw new Error(`Chrome upload ended with: ${lastAsyncUploadState}`);
    }

    const seconds = (attempt * UPLOAD_POLL_INTERVAL_MS) / 1000;

    update(`Chrome is processing the upload ${pc.dim(`${seconds}s`)}`);
  }

  throw new Error("Chrome upload is still processing. Check the dashboard.");
};

/** Uploads the zip, then submits it for review. It goes live once approved. */
export const submitToChrome = async (zipPath: string) => {
  const token = await step(
    "Signing in to Google",
    getAccessToken,
    "Signed in to Google",
  );

  const upload = await step(
    "Uploading package",
    () =>
      request<UploadResponse>(
        token,
        `${API_URL}/upload/v2/${getItemName()}:upload`,
        "Chrome upload",
        { body: Bun.file(zipPath), method: "POST" },
      ),
    "Package uploaded",
  );

  if (upload.uploadState !== "SUCCEEDED") {
    await step(
      "Chrome is processing the upload",
      (update) => waitForUpload(token, update),
      "Upload processed",
    );
  }

  const result = await step(
    "Submitting for review",
    () =>
      request<PublishResponse>(
        token,
        `${API_URL}/v2/${getItemName()}:publish`,
        "Chrome publish",
        {
          body: JSON.stringify({ publishType: "DEFAULT_PUBLISH" }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        },
      ),
    (response) => `Submitted for review ${pc.dim(`(${response.state})`)}`,
  );

  for (const warning of result.warningInfo?.warnings ?? []) {
    p.log.warn(`${warning.reason}: ${warning.description}`);
  }
};
