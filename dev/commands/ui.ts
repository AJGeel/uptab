import * as p from "@clack/prompts";
import pc from "picocolors";

import { ROOT_DIR } from "./utils";

export { p, pc };

/** `--yes` skips confirmation prompts, e.g. for CI. */
const isYes = process.argv.includes("--yes");

export const header = (title: string) =>
  p.intro(pc.bgYellowBright(pc.black(pc.bold(` ⬆️  ${title} `))));

/** Shows a spinner while `task` runs, then a ✓ or ✗ line. */
export const step = async <T>(
  title: string,
  task: (update: (message: string) => void) => Promise<T>,
  done: string | ((result: T) => string) = title,
) => {
  const spinner = p.spinner();

  spinner.start(title);

  try {
    const result = await task((message) => spinner.message(message));

    spinner.stop(typeof done === "function" ? done(result) : done);

    return result;
  } catch (error) {
    spinner.error(pc.red(title));
    throw error;
  }
};

const forEachLine = async (
  stream: ReadableStream<Uint8Array>,
  onLine: (line: string) => void,
) => {
  const decoder = new TextDecoder();
  let buffer = "";

  for await (const chunk of stream) {
    const lines = (buffer + decoder.decode(chunk, { stream: true })).split(
      "\n",
    );

    buffer = lines.pop() ?? "";
    lines.filter((line) => line.trim()).forEach(onLine);
  }

  if (buffer.trim()) {
    onLine(buffer);
  }
};

/**
 * Runs a command with its output in a small scrolling panel. The panel
 * collapses on success and stays on screen if the command fails.
 */
export const runTask = async (
  title: string,
  cmd: string[],
  env: Record<string, string> = {},
) => {
  const panel = p.taskLog({ title, limit: 6 });
  const proc = Bun.spawn(cmd, {
    cwd: ROOT_DIR,
    env: { ...process.env, ...env },
    stdout: "pipe",
    stderr: "pipe",
  });
  const print = (line: string) => panel.message(pc.dim(line));

  await Promise.all([
    forEachLine(proc.stdout, print),
    forEachLine(proc.stderr, print),
  ]);

  if ((await proc.exited) !== 0) {
    panel.error(pc.red(`${title} failed`));
    throw new Error(`Command failed: ${cmd.join(" ")}`);
  }

  panel.success(title);
};

/** Asks before an outward-facing action. Exits without changes on "no". */
export const confirmOrExit = async (message: string) => {
  if (isYes) {
    return;
  }

  if (!process.stdin.isTTY) {
    throw new Error("Can't ask for confirmation here. Pass --yes to continue.");
  }

  const answer = await p.confirm({ message });

  if (p.isCancel(answer) || !answer) {
    p.cancel("Cancelled. Nothing was changed.");
    process.exit(0);
  }
};

/** Runs a CLI entry point, ending with a red outro on errors. */
export const runCli = (main: () => Promise<void>) =>
  main().catch((error: Error) => {
    p.log.error(error.message);
    p.outro(pc.red("Failed"));
    process.exit(1);
  });
