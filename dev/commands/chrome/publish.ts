/* eslint-disable camelcase */

import { BASE_URL, EXTENSION_ID } from "./_utils/constants";
import { getChromeHeaders } from "./_utils/getChromeHeaders";
import { getChromeToken } from "./_utils/getChromeToken";

const publish = async () => {
  const token = await getChromeToken();

  if (!token) {
    return;
  }

  const url = BASE_URL + EXTENSION_ID + "/publish";

  console.log(url);

  try {
    const response = await fetch(url, {
      headers: getChromeHeaders(token),
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const data = await response.json();

    console.log(data);
  } catch (error) {
    throw new Error(`Error fetching data: ${error}`);
  }
};

publish();
