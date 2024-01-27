import { log } from "../_utils/log";

// Docs: https://addons-server.readthedocs.io/en/latest/topics/api/addons.html#upload-create

export const run = () => {
  log('🚨 Firefox does not have a separate "publish" API.');
  log('👉 Please publish using "bun firefox:store" > updatePackage instead.');
};
