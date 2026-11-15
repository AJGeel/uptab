export const isFirefox = (() => navigator.userAgent.includes("Firefox"))();

/**
 * Firefox shows data categories from version 140. Read from the user agent, as
 * a permission request has to start straight from a click, with no `await` first.
 */
export const supportsDataConsent = () =>
  Number(/Firefox\/(\d+)/.exec(navigator.userAgent)?.[1] ?? 0) >= 140;
