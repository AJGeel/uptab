export type ReleaseNotes = {
  /** Release date as written in the changelog (yyyy-MM-dd), if it has one. */
  date: string | null;
  /** The release's sections and bullet points, as Markdown. */
  body: string;
};

/** `## [V2.0.0] — 2026-10-21`, with the date and the "V" optional. */
const HEADING = /^## \[V?([^\]]+)\](?:\s*[—–-]\s*(\S+))?\s*$/;

/** The part of CHANGELOG.md for `version`, or undefined if it has no section. */
export const parseReleaseNotes = (
  changelog: string,
  version: string,
): ReleaseNotes | undefined => {
  const lines = changelog.split(/\r?\n/);
  const start = lines.findIndex((line) => HEADING.exec(line)?.[1] === version);

  if (start === -1) {
    return undefined;
  }

  const next = lines.findIndex(
    (line, index) => index > start && line.startsWith("## "),
  );
  const body = lines
    .slice(start + 1, next === -1 ? undefined : next)
    .join("\n")
    .trim();

  return body
    ? { date: HEADING.exec(lines[start])?.[2] ?? null, body }
    : undefined;
};
