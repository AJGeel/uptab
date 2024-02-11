/* eslint-disable camelcase */

import { log } from "../../_utils/log";

type AccessToken = string;
const tokenEndpoint = "https://oauth2.googleapis.com/token";

export const getChromeToken = async (): Promise<AccessToken | void> => {
  const body = new URLSearchParams({
    client_id: process.env.CHROME_CLIENT_ID ?? "",
    client_secret: process.env.CHROME_CLIENT_SECRET ?? "",
    grant_type: "refresh_token",
    refresh_token: process.env.CHROME_REFRESH_TOKEN ?? "",
  });

  try {
    const response = await fetch(tokenEndpoint, {
      body: body.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed with status: ${response.status}`);
    }

    const data = await response.json();

    log("✅ Token refresh succeeded!");
    return data.access_token;
  } catch (error) {
    throw new Error(`Error refreshing access token: ${error}`);
  }
};
