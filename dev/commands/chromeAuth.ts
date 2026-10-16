/**
 * Gets a Chrome Web Store refresh token and saves it to `.env`.
 *
 * Usage: bun store:auth
 *
 * Needs CHROME_CLIENT_ID and CHROME_CLIENT_SECRET from a "Desktop app" OAuth
 * client. Sign in with the account that owns the Chrome Web Store listing.
 * See docs/2-releasing.md.
 */
import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

import { SCOPE, TOKEN_URL } from "./chrome";
import { ROOT_DIR, ensureOk, log, requireEnv, run } from "./utils";

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const ENV_PATH = resolve(ROOT_DIR, ".env");
const ENV_KEY = "CHROME_REFRESH_TOKEN";

/** Starts a local server and resolves with the code Google redirects back with. */
const waitForAuthCode = (state: string) => {
  let resolveCode: (code: string) => void;
  let rejectCode: (error: Error) => void;

  const code = new Promise<string>((resolvePromise, rejectPromise) => {
    resolveCode = resolvePromise;
    rejectCode = rejectPromise;
  });

  const server = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    fetch: (request) => {
      const params = new URL(request.url).searchParams;

      if (!params.has("code") && !params.has("error")) {
        return new Response("Not found", { status: 404 });
      }

      if (params.get("state") !== state) {
        rejectCode(new Error("OAuth state mismatch. Try again."));
      } else if (params.has("error")) {
        rejectCode(new Error(`Google returned: ${params.get("error")}`));
      } else {
        resolveCode(params.get("code") as string);
      }

      return new Response("Done. You can close this tab.");
    },
  });

  return { code, redirectUri: `http://127.0.0.1:${server.port}`, server };
};

const saveRefreshToken = (token: string) => {
  const lines = existsSync(ENV_PATH)
    ? readFileSync(ENV_PATH, "utf8").split("\n")
    : [];
  const index = lines.findIndex((line) => line.startsWith(`${ENV_KEY}=`));
  const entry = `${ENV_KEY}=${token}`;

  if (index === -1) {
    lines.push(entry);
  } else {
    lines[index] = entry;
  }

  writeFileSync(ENV_PATH, lines.join("\n"));
};

const main = async () => {
  const env = requireEnv("CHROME_CLIENT_ID", "CHROME_CLIENT_SECRET");
  const state = crypto.randomUUID();
  const { code, redirectUri, server } = waitForAuthCode(state);

  const authUrl = `${AUTH_URL}?${new URLSearchParams({
    access_type: "offline",
    client_id: env.CHROME_CLIENT_ID,
    // Forces Google to return a new refresh token, also on repeat logins.
    prompt: "consent",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPE,
    state,
  })}`;

  log.info("Opening Google sign-in. If it doesn't open, visit:");
  log.info(authUrl);
  await run(["open", authUrl]).catch(() => undefined);

  try {
    const response = await fetch(TOKEN_URL, {
      body: new URLSearchParams({
        client_id: env.CHROME_CLIENT_ID,
        client_secret: env.CHROME_CLIENT_SECRET,
        code: await code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
      method: "POST",
    });

    await ensureOk(response, "Token exchange");

    const { refresh_token: refreshToken } = await response.json();

    if (!refreshToken) {
      throw new Error("Google didn't return a refresh token. Try again.");
    }

    saveRefreshToken(refreshToken);
    log.success(
      `Saved ${ENV_KEY} to .env. Check it with: bun store:status chrome`,
    );
  } finally {
    server.stop();
  }
};

main().catch((error: Error) => {
  log.error(error.message);
  process.exit(1);
});
