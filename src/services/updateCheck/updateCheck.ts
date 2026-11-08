import { runtime } from "webextension-polyfill";

export type UpdateCheck =
  | { status: "available"; version?: string }
  | { status: "latest" | "throttled" | "unsupported" | "error" };

/** Firefox has no update check: it updates extensions by itself. */
export const canCheckForUpdate = () =>
  typeof runtime.requestUpdateCheck === "function";

type RawResult =
  | { status?: string; version?: string }
  | [string, { version?: string }?]
  | undefined;

// Depending on the browser and the polyfill, it's an object or a [status, details] pair.
const normalize = (result: RawResult) =>
  Array.isArray(result)
    ? { status: result[0], version: result[1]?.version }
    : { status: result?.status, version: result?.version };

/** Asks the browser to look for a newer version. It downloads one in the background. */
export const checkForUpdate = async (): Promise<UpdateCheck> => {
  if (!canCheckForUpdate()) {
    return { status: "unsupported" };
  }

  try {
    const { status, version } = normalize(
      (await runtime.requestUpdateCheck()) as unknown as RawResult,
    );

    switch (status) {
      case "update_available":
        return { status: "available", version };
      case "no_update":
        return { status: "latest" };
      case "throttled":
        return { status: "throttled" };
      default:
        return { status: "error" };
    }
  } catch {
    return { status: "error" };
  }
};
