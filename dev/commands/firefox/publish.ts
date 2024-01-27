import { log } from "../_utils/log";

export const run = () => {
  log('🚨 Firefox does not have a separate "publish" API.');
  log('👉 Please publish using "bun firefox:store" > updatePackage instead.');
};
