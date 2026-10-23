import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getLocation, GpsError } from "./getLocation";

type Outcome = { code: number } | { latitude: number; longitude: number };

const stubGeolocation = (outcomes: Outcome[]) => {
  const getCurrentPosition = vi.fn(
    (success: (position: unknown) => void, error: (error: unknown) => void) => {
      const outcome = outcomes.shift()!;

      if ("code" in outcome) {
        error(outcome);
        return;
      }

      success({ coords: outcome });
    },
  );

  vi.stubGlobal("navigator", { geolocation: { getCurrentPosition } });

  return getCurrentPosition;
};

const position = { latitude: 52.37, longitude: 4.9 };

describe("getLocation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("resolves with the coordinates", async () => {
    stubGeolocation([position]);

    expect(await getLocation()).toEqual(position);
  });

  it("doesn't retry a denied permission", async () => {
    const getCurrentPosition = stubGeolocation([{ code: 1 }]);

    await expect(getLocation()).rejects.toMatchObject({ reason: "denied" });
    expect(getCurrentPosition).toHaveBeenCalledTimes(1);
  });

  it("retries a timeout, falling back to low accuracy", async () => {
    const getCurrentPosition = stubGeolocation([{ code: 3 }, position]);

    const result = getLocation();
    await vi.runAllTimersAsync();

    expect(await result).toEqual(position);
    expect(
      (getCurrentPosition.mock.calls as unknown[][]).map(
        ([, , options]) => options,
      ),
    ).toEqual([
      expect.objectContaining({ enableHighAccuracy: true }),
      expect.objectContaining({ enableHighAccuracy: false }),
    ]);
  });

  it("gives up after the last attempt, reporting why", async () => {
    const getCurrentPosition = stubGeolocation([
      { code: 2 },
      { code: 2 },
      { code: 3 },
    ]);

    const result = getLocation();
    const assertion = expect(result).rejects.toMatchObject({
      reason: "timeout",
    });
    await vi.runAllTimersAsync();

    await assertion;
    expect(getCurrentPosition).toHaveBeenCalledTimes(3);
  });

  it("reports unavailable when the browser has no geolocation", async () => {
    vi.stubGlobal("navigator", {});

    const result = getLocation();
    const assertion = expect(result).rejects.toBeInstanceOf(GpsError);
    await vi.runAllTimersAsync();

    await assertion;
  });
});
