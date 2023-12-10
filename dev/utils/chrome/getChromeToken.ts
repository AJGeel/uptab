/* eslint-disable camelcase */

type AccessToken = string;

export const getChromeToken = async (): Promise<AccessToken | void> => {
  const tokenEndpoint = "https://oauth2.googleapis.com/token";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const body = new URLSearchParams({
    client_id: process.env.CHROME_CLIENT_ID ?? "",
    client_secret: process.env.CHROME_CLIENT_SECRET ?? "",
    grant_type: "refresh_token",
    refresh_token: process.env.CHROME_REFRESH_TOKEN ?? "",
  });

  try {
    const response = await fetch(tokenEndpoint, {
      body: body.toString(),
      headers: headers,
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed with status: ${response.status}`);
    }

    const data = await response.json();

    return data.access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
};
