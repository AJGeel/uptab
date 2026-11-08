import { beforeEach, describe, expect, it, vi } from "vitest";

const runtime = vi.hoisted(() => ({
  requestUpdateCheck: vi.fn() as ReturnType<typeof vi.fn> | undefined,
}));

vi.mock("webextension-polyfill", () => ({ runtime }));

import { checkForUpdate } from "./updateCheck";

describe("checkForUpdate", () => {
  beforeEach(() => {
    runtime.requestUpdateCheck = vi.fn();
  });

  it("reports an available update from an object result", async () => {
    runtime.requestUpdateCheck!.mockResolvedValue({
      status: "update_available",
      version: "2.2.0",
    });

    expect(await checkForUpdate()).toEqual({
      status: "available",
      version: "2.2.0",
    });
  });

  it("reports an available update from a [status, details] result", async () => {
    runtime.requestUpdateCheck!.mockResolvedValue([
      "update_available",
      { version: "2.2.0" },
    ]);

    expect(await checkForUpdate()).toEqual({
      status: "available",
      version: "2.2.0",
    });
  });

  it.each([
    ["no_update", "latest"],
    ["throttled", "throttled"],
    ["something_new", "error"],
  ])("maps %s to %s", async (status, expected) => {
    runtime.requestUpdateCheck!.mockResolvedValue({ status });

    expect(await checkForUpdate()).toEqual({ status: expected });
  });

  it("reports an error when the check fails", async () => {
    runtime.requestUpdateCheck!.mockRejectedValue(new Error("offline"));

    expect(await checkForUpdate()).toEqual({ status: "error" });
  });

  it("is unsupported without the browser API", async () => {
    runtime.requestUpdateCheck = undefined;

    expect(await checkForUpdate()).toEqual({ status: "unsupported" });
  });
});
