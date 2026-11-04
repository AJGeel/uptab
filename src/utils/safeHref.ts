const WEB_URL = /^https?:\/\//i;

/**
 * A link's `href`, or undefined unless it's a web address. Bookmarks can be
 * `javascript:` bookmarklets, and shortlinks accept any text.
 */
export const safeHref = (url: string | undefined) =>
  url && WEB_URL.test(url.trim()) ? url : undefined;
