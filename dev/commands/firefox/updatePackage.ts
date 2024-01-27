import { BASE_URL, FILE_NAME, FILE_PATH } from "./_helpers/constants";
import { generateJWT } from "./_helpers/generateJWT";
import { log } from "../_utils/log";

// API Reference: https://addons-server.readthedocs.io/en/latest/topics/api/addons.html#upload-create
export const run = async () => {
  const url = BASE_URL + "addons/upload";

  try {
    const formData = new FormData();
    formData.append("upload", new File([FILE_PATH], FILE_NAME));
    formData.append("channel", "listed");

    const response = await fetch(url, {
      body: formData,
      headers: {
        Authorization: `JWT ${generateJWT()}`,
        "Content-Type": "multipart/form-data",
      },
      method: "POST",
    });

    log(response);

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const data = await response.json();

    log(data);
  } catch (error) {
    log(`Error uploading addon: ${error}`);
  }
};
