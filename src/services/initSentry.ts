export const initSentry = () => {
  const dsn = import.meta.env.VITE_GLITCHTIP_DSN;

  if (!dsn) {
    return;
  }

  const load = () =>
    import("@sentry/browser").then((Sentry) => Sentry.init({ dsn }));

  if ("requestIdleCallback" in window) {
    requestIdleCallback(load, { timeout: 3000 });
  } else {
    setTimeout(load, 1000);
  }
};
