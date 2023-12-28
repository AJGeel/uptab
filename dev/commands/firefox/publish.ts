import { log } from "../_utils/log";

const publish = () => {
  log('🚨 Firefox does not have a separate "publish" API.');
  log('👉 Please publish using "bun firefox:store:update" intead.');
};

publish();
