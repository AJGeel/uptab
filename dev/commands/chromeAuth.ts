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

import { SCOPE, TOKEN_URL, TokenResponse } from "./chrome";
import { header, p, pc, runCli, step } from "./ui";
import { ROOT_DIR, ensureOk, read, requireEnv } from "./utils";

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

      const error =
        params.get("state") !== state
          ? "OAuth state mismatch. Try again."
          : params.get("error") && `Google returned: ${params.get("error")}`;

      if (!error) {
        resolveCode(params.get("code") as string);

        return new Response("✨ Signed in. You can close this tab.");
      }

      // Give the page time to load before the script exits on the error.
      setTimeout(() => rejectCode(new Error(error)), 200);

      return new Response(`Sign-in failed: ${error} See the terminal.`, {
        status: 400,
      });
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

  header("UpTab · Chrome Web Store sign-in");
  p.log.info(
    `Sign in with the account that owns the Chrome Web Store listing.\n${pc.dim("If your browser doesn't open, visit:")}\n${pc.cyan(authUrl)}`,
  );
  await read(["open", authUrl]).catch(() => undefined);

  try {
    const authCode = await step(
      "Waiting for you to sign in with Google",
      () => code,
      "Signed in",
    );

    const refreshToken = await step(
      "Getting a refresh token",
      async () => {
        const response = await fetch(TOKEN_URL, {
          body: new URLSearchParams({
            client_id: env.CHROME_CLIENT_ID,
            client_secret: env.CHROME_CLIENT_SECRET,
            code: authCode,
            grant_type: "authorization_code",
            redirect_uri: redirectUri,
          }),
          method: "POST",
        });

        await ensureOk(response, "Token exchange");

        const { refresh_token: token } =
          (await response.json()) as TokenResponse;

        if (!token) {
          throw new Error("Google didn't return a refresh token. Try again.");
        }

        return token;
      },
      "Got a refresh token",
    );

    saveRefreshToken(refreshToken);
    p.outro(
      `🔑 ${pc.green(`Saved ${ENV_KEY} to .env`)} ${pc.dim("· check it with bun store:status chrome")}`,
    );
  } finally {
    server.stop();
  }
};

runCli(main);
