/**
 * Tags the current version on main, pushes the tag and creates a GitHub
 * release with the matching CHANGELOG.md section as release notes.
 *
 * Usage: bun tag-release [--dry-run] [--yes]
 */
import { readFileSync } from "fs";
import { resolve } from "path";

import { confirmOrExit, header, p, pc, runCli, step } from "./ui";
import { ROOT_DIR, read } from "./utils";

const RELEASE_BRANCH = "main";

/** Returns the lines under `## [V1.2.3]`, up to the next release heading. */
export const getReleaseNotes = (tag: string) => {
  const lines = readFileSync(resolve(ROOT_DIR, "CHANGELOG.md"), "utf8").split(
    "\n",
  );
  const start = lines.findIndex((line) => line.startsWith(`## [${tag}]`));

  if (start === -1) {
    throw new Error(`CHANGELOG.md has no "## [${tag}]" section.`);
  }

  const end = lines.findIndex(
    (line, i) => i > start && line.startsWith("## ["),
  );

  return lines
    .slice(start + 1, end === -1 ? undefined : end)
    .join("\n")
    .trim();
};

const assertReadyToTag = async (tag: string) => {
  if ((await read(["git", "branch", "--show-current"])) !== RELEASE_BRANCH) {
    throw new Error(`Switch to ${RELEASE_BRANCH} first.`);
  }

  if (await read(["git", "status", "--porcelain"])) {
    throw new Error("Commit or stash your changes first.");
  }

  await read(["git", "fetch", "--quiet", "--tags", "origin", RELEASE_BRANCH]);

  const [head, remoteHead] = await Promise.all([
    read(["git", "rev-parse", "HEAD"]),
    read(["git", "rev-parse", `origin/${RELEASE_BRANCH}`]),
  ]);

  if (head !== remoteHead) {
    throw new Error(
      `Local ${RELEASE_BRANCH} doesn't match origin/${RELEASE_BRANCH}. Pull or push first.`,
    );
  }

  if (await read(["git", "tag", "--list", tag])) {
    throw new Error(`Tag ${tag} already exists.`);
  }
};

const main = async () => {
  const isDryRun = process.argv.includes("--dry-run");
  const { version } = JSON.parse(
    readFileSync(resolve(ROOT_DIR, "package.json"), "utf8"),
  );
  const tag = `V${version}`;

  header(isDryRun ? "UpTab · Release (dry run)" : "UpTab · Release");

  await step(
    `Checking ${RELEASE_BRANCH} is clean and up to date`,
    () => assertReadyToTag(tag),
    `On ${RELEASE_BRANCH}, clean and in sync with origin`,
  );

  const notes = getReleaseNotes(tag);
  const commit = await read(["git", "log", "-1", "--format=%h %s"]);

  p.note(notes, `${pc.cyan(pc.bold(tag))} ${pc.dim(`on ${commit}`)}`);

  if (isDryRun) {
    p.outro(pc.green("Dry run passed · nothing was tagged or pushed"));
    return;
  }

  await confirmOrExit(`Tag ${tag}, push it and publish the GitHub release?`);

  await step(
    `Tagging ${tag}`,
    () => read(["git", "tag", tag]),
    `Tagged ${tag}`,
  );
  await step(
    "Pushing the tag to GitHub",
    () => read(["git", "push", "origin", tag]),
    "Tag pushed",
  );

  const url = await step(
    "Publishing the GitHub release",
    () =>
      read([
        "gh",
        "release",
        "create",
        tag,
        "--title",
        tag,
        "--notes",
        notes,
        "--verify-tag",
      ]),
    "GitHub release published",
  );

  p.outro(`🎉 ${pc.green(`Released ${tag}`)} ${pc.dim("→")} ${pc.cyan(url)}`);
};

if (import.meta.main) {
  runCli(main);
}
