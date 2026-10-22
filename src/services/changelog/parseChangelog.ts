export type Release = {
  version: string;
  /** Release date as written in the changelog (yyyy-MM-dd), if it has one. */
  date: string | null;
  /** The release's sections and bullet points, as Markdown. */
  body: string;
};

export type Changelog = {
  /** The text between the title and the first release, as Markdown. */
  intro: string;
  /** Newest first, as in the file. */
  releases: Release[];
};

/** `## [V2.0.0] — 2026-10-21`, with the date and the "V" optional. */
const HEADING = /^## \[V?([^\]]+)\](?:\s*[—–-]\s*(\S+))?\s*$/;

/** Splits CHANGELOG.md into its intro and releases. Releases without notes are left out. */
export const parseChangelog = (changelog: string): Changelog => {
  const result: Changelog = { intro: "", releases: [] };

  // Every "## " line starts a section; the text before the first one is the intro.
  for (const section of changelog.split(/\r?\n(?=## )/)) {
    const [heading, ...lines] = section.split(/\r?\n/);
    const match = HEADING.exec(heading);
    const body = lines.join("\n").trim();

    if (match && body) {
      result.releases.push({ version: match[1], date: match[2] ?? null, body });
    } else if (!heading.startsWith("## ")) {
      result.intro = [heading, ...lines]
        .filter((line) => !line.startsWith("# "))
        .join("\n")
        .trim();
    }
  }

  return result;
};

/** The part of CHANGELOG.md for `version`, or undefined if it has no section. */
export const parseReleaseNotes = (changelog: string, version: string) => {
  const release = parseChangelog(changelog).releases.find(
    (candidate) => candidate.version === version,
  );

  return release && { date: release.date, body: release.body };
};
