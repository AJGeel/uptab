/* eslint-disable no-console */
/* eslint-disable camelcase */

import fs from "fs";

import { paths } from "../utils/paths";
import { promptUser } from "../utils/promptUser";

/**
 * Get an Access Key for a Success Code. Can only be used once.
 */
const getChromeAccessTokens = async () => {
  const successCode = await promptUser(
    "👇 Paste your Chrome Success Code here: \n"
  );

  const url = "https://accounts.google.com/o/oauth2/token";

  const params = new URLSearchParams({
    client_id: process.env.CHROME_CLIENT_ID ?? "",
    client_secret: process.env.CHROME_CLIENT_SECRET ?? "",
    code: successCode,
    grant_type: "authorization_code",
    redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
  });

  const response = await fetch(url, {
    body: params.toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to get access token: ${response.statusText}. Perhaps this success code has already been used.`
    );
  }

  const data = await response.json();

  if (!data.access_token || !data.refresh_token) {
    throw new Error(`Failed to get access token.`);
  }

  try {
    fs.writeFileSync(
      paths.chromeTokenPath,
      JSON.stringify(data, null, 2),
      "utf-8"
    );
    console.log(`Tokens have been stored in ${paths.chromeTokenPath}.`);
  } catch (error) {
    console.error(`Error saving data: ${error}`);
  }
};

getChromeAccessTokens();
