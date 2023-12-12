import { EXTENSION_ID, UPLOAD_URL } from "./_utils/constants";
import { getChromeHeaders } from "./_utils/getChromeHeaders";
import { getChromeToken } from "./_utils/getChromeToken";

const CONSTANTS = {
  fileName: `chrome-extension.zip`,
  filePath: "/dist/chromium.zip",
};

const updatePackage = async () => {
  const token = await getChromeToken();

  if (!token) {
    return;
  }

  const url = UPLOAD_URL + EXTENSION_ID;

  try {
    const formData = new FormData();
    formData.append("file", new File([CONSTANTS.fileName], CONSTANTS.filePath));

    const response = await fetch(url, {
      body: formData,
      headers: getChromeHeaders(token),
      method: "PUT",
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

updatePackage();
