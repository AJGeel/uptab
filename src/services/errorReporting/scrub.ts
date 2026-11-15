import type { Breadcrumb, ErrorEvent } from "@sentry/browser";

/** A web address, with whatever query it carries: places, bookmarks, searches. */
const WEB_URL = /\b(?:https?|wss?|ftp):\/\/[^\s"'<>)\]]+/gi;
/** The extension's own origin goes, its file paths stay: they make stack traces readable. */
const EXTENSION_ORIGIN = /\b(?:chrome|moz)-extension:\/\/[^/\s"'<>)]+/gi;
const COORDINATE =
  /\b(lat(?:itude)?|lon(?:gitude)?)(["']?\s*[=:]\s*)-?\d+(?:\.\d+)?/gi;

export const scrubString = (text: string) =>
  text
    .replace(WEB_URL, "[url]")
    .replace(EXTENSION_ORIGIN, "")
    .replace(COORDINATE, "$1$2[redacted]");

const scrubDeep = (value: unknown): unknown => {
  if (typeof value === "string") {
    return scrubString(value);
  }

  if (Array.isArray(value)) {
    return value.map(scrubDeep);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, scrubDeep(entry)]),
    );
  }

  return value;
};

/** What's left of an error report: the error, its stack, the version and the browser. */
export const scrubEvent = (event: ErrorEvent): ErrorEvent => {
  const scrubbed = scrubDeep(event) as ErrorEvent;

  delete scrubbed.request;
  delete scrubbed.user;

  return scrubbed;
};

export const scrubBreadcrumb = (breadcrumb: Breadcrumb): Breadcrumb =>
  scrubDeep(breadcrumb) as Breadcrumb;
