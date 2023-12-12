import { UPLOAD_URL, FILE_PATH, FILE_NAME } from "./_helpers/constants";
import { getChromeHeaders } from "./_helpers/getChromeHeaders";
import { getChromeToken } from "./_helpers/getChromeToken";
import { log } from "../_utils/log";

const initPackage = async () => {
  const token = await getChromeToken();

  if (!token) {
    return;
  }

  const url = UPLOAD_URL;

  try {
    const formData = new FormData();
    formData.append("file", new File([FILE_PATH], FILE_NAME));

    const response = await fetch(url, {
      body: formData,
      headers: getChromeHeaders(token),
      method: "POST",
    });

    log(response);

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

initPackage();