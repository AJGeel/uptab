import { describe, expect, it } from "vitest";

import { getActiveSavedLocation } from "./resolveLocation";
import { LocationSettings } from "./types";

const work = { id: "work", label: "Work", latitude: 3, longitude: 4 };

const settings = (active: string): LocationSettings => ({
  active,
  saved: [{ id: "home", label: "Home", latitude: 1, longitude: 2 }, work],
});

describe("getActiveSavedLocation", () => {
  it("returns the active saved place", () => {
    expect(getActiveSavedLocation(settings("work"))).toEqual({
      area: "Work",
      latitude: 3,
      longitude: 4,
    });
  });

  it("returns nothing for GPS or an unknown id", () => {
    expect(getActiveSavedLocation(settings("gps"))).toBeUndefined();
    expect(getActiveSavedLocation(settings("gone"))).toBeUndefined();
  });
});
