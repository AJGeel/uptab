/* eslint-disable no-console */
import { resolve } from "path";

export const ROOT_DIR = resolve(import.meta.dir, "..", "..");
export const DIST_DIR = resolve(ROOT_DIR, "dist");

export const log = {
  info: (message: string) => console.log(message),
  step: (message: string) => console.log(`\n▶ ${message}`),
  success: (message: string) => console.log(`✅ ${message}`),
  warn: (message: string) => console.warn(`⚠️  ${message}`),
  error: (message: string) => console.error(`❌ ${message}`),
};

/** Reads env vars (Bun loads `.env` automatically) and fails on missing ones. */
export const requireEnv = <T extends string>(...names: T[]) => {
  const missing = names.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(
      `Missing env vars: ${missing.join(", ")}. See .env.example.`,
    );
  }

  return Object.fromEntries(
    names.map((name) => [name, process.env[name] as string]),
  ) as Record<T, string>;
};

/** Throws with the response body, so API errors are readable. */
export const ensureOk = async (response: Response, action: string) => {
  if (!response.ok) {
    throw new Error(
      `${action} failed (${response.status}): ${await response.text()}`,
    );
  }

  return response;
};

/** Runs a command in the repo root with inherited output. */
export const run = async (cmd: string[], env: Record<string, string> = {}) => {
  const proc = Bun.spawn(cmd, {
    cwd: ROOT_DIR,
    env: { ...process.env, ...env },
    stdout: "inherit",
    stderr: "inherit",
  });

  if ((await proc.exited) !== 0) {
    throw new Error(`Command failed: ${cmd.join(" ")}`);
  }
};

/** Runs a command in the repo root and returns its trimmed stdout. */
export const read = async (cmd: string[]) => {
  const proc = Bun.spawn(cmd, { cwd: ROOT_DIR, stdout: "pipe" });
  const output = await new Response(proc.stdout).text();

  if ((await proc.exited) !== 0) {
    throw new Error(`Command failed: ${cmd.join(" ")}`);
  }

  return output.trim();
};

/** -1, 0 or 1, comparing dotted numeric versions like "1.4.0". */
export const compareVersions = (a: string, b: string) => {
  const left = a.split(".").map(Number);
  const right = b.split(".").map(Number);

  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    const diff = (left[i] ?? 0) - (right[i] ?? 0);

    if (diff !== 0) {
      return Math.sign(diff);
    }
  }

  return 0;
};

export const sleep = (ms: number) =>
  new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
