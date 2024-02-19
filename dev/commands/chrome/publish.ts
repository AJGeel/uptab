import { BASE_URL, EXTENSION_ID } from "./_helpers/constants";
import { getChromeHeaders } from "./_helpers/getChromeHeaders";
import { getChromeToken } from "./_helpers/getChromeToken";
import { log } from "../_utils/log";

export const run = async () => {
  const token = await getChromeToken();

  if (!token) {
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}${EXTENSION_ID}/publish`, {
      headers: getChromeHeaders(token),
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const data = await response.json();

    log(data);
  } catch (error) {
    throw new Error(`Error fetching data: ${error}`);
  }
};
