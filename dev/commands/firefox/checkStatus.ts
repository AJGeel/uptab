import { BASE_URL, EXTENSION_ID } from "./_helpers/constants";
import { log } from "../_utils/log";

// API Reference: https://addons-server.readthedocs.io/en/latest/topics/api/addons.html#detail

export const run = async () => {
  const url = BASE_URL + "addons/addon/" + EXTENSION_ID;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const data = await response.json();

    log(data);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
