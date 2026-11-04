/** Schemes that run code or render content in the page when followed. */
const UNSAFE_SCHEME = /^(javascript|data|vbscript):/i;

/**
 * A link's `href`, or undefined when it would run script on click. Bookmarks
 * can be `javascript:` bookmarklets, and shortlinks accept any text.
 */
export const safeHref = (url: string | undefined) => {
  // Browsers ignore whitespace and control characters inside a scheme.
  // eslint-disable-next-line no-control-regex
  const compact = url?.replace(/[\u0000- ]/g, "");

  return compact && UNSAFE_SCHEME.test(compact) ? undefined : url;
};
