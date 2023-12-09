import * as Sentry from "@sentry/browser";

export const initSentry = () => {
  Sentry.init({
    dsn: import.meta.env.VITE_GLITCHTIP_DSN ?? "",
  });
};
