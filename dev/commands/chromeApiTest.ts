/* eslint-disable camelcase */

import { getChromeToken } from "../utils/chrome/getChromeToken";

async function fetchDataWithAuthorization(token: string, itemId: string) {
  const url = `https://www.googleapis.com/chromewebstore/v1.1/items/${itemId}?projection=DRAFT`;
  const headers = {
    Authorization: `Bearer ${token}`,
    "x-goog-api-version": "2",
  };

  try {
    const response = await fetch(url, {
      headers: headers,
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const chromeApiTest = async () => {
  const token = await getChromeToken();

  if (!token) {
    return;
  }

  const data = await fetchDataWithAuthorization(
    token,
    process.env.CHROME_EXTENSION_ID ?? ""
  );

  console.log(data);
};

chromeApiTest();
