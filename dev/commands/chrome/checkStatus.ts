import { BASE_URL, EXTENSION_ID } from "./_helpers/constants";
import { getChromeHeaders } from "./_helpers/getChromeHeaders";
import { getChromeToken } from "./_helpers/getChromeToken";
import { log } from "../_utils/log";

const checkStatus = async () => {
  const token = await getChromeToken();

  if (!token) {
    return;
  }

  const url = BASE_URL + EXTENSION_ID + "?projection=DRAFT";

  try {
    const response = await fetch(url, {
      headers: getChromeHeaders(token),
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const data = await response.json();

    log(data);
    return data;
  } catch (error) {
    throw new Error(`Error fetching data: ${error}`);
  }
};

checkStatus();
