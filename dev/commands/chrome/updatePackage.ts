import {
  EXTENSION_ID,
  UPLOAD_URL,
  FILE_PATH,
  FILE_NAME,
} from "./_helpers/constants";
import { getChromeHeaders } from "./_helpers/getChromeHeaders";
import { getChromeToken } from "./_helpers/getChromeToken";
import { log } from "../_utils/log";

export const run = async () => {
  const token = await getChromeToken();

  if (!token) {
    return;
  }

  const url = UPLOAD_URL + EXTENSION_ID;

  try {
    const formData = new FormData();
    formData.append("file", new File([FILE_PATH], FILE_NAME));

    const response = await fetch(url, {
      body: formData,
      headers: getChromeHeaders(token),
      method: "PUT",
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
