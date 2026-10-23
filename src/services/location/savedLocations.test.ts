import { describe, expect, it } from "vitest";

import {
  addSavedLocation,
  distanceKm,
  MAX_SAVED_LOCATIONS,
  removeSavedLocation,
  setActiveLocation,
} from "./savedLocations";
import { LocationSettings } from "./types";

const amsterdam = { label: "Amsterdam", latitude: 52.3676, longitude: 4.9041 };
const rotterdam = { label: "Rotterdam", latitude: 51.9244, longitude: 4.4777 };

const empty: LocationSettings = { active: "gps", saved: [] };

describe("distanceKm", () => {
  it("measures the distance between two places", () => {
    expect(distanceKm(amsterdam, rotterdam)).toBeCloseTo(57, 0);
  });

  it("is zero for the same place", () => {
    expect(distanceKm(amsterdam, amsterdam)).toBe(0);
  });
});

describe("addSavedLocation", () => {
  it("adds the place and makes it active", () => {
    const result = addSavedLocation(empty, amsterdam, "a");

    expect(result).toEqual({
      ok: true,
      location: {
        active: "a",
        saved: [{ ...amsterdam, id: "a" }],
      },
    });
  });

  it("blocks a place within a kilometre of a saved one", () => {
    const { location } = addSavedLocation(empty, amsterdam, "a") as {
      location: LocationSettings;
    };

    const result = addSavedLocation(
      location,
      { ...amsterdam, label: "Near", latitude: amsterdam.latitude + 0.005 },
      "b",
    );

    expect(result).toMatchObject({
      ok: false,
      reason: "duplicate",
      existing: { id: "a", label: "Amsterdam" },
    });
  });

  it("allows a place further away", () => {
    const { location } = addSavedLocation(empty, amsterdam, "a") as {
      location: LocationSettings;
    };

    expect(addSavedLocation(location, rotterdam, "b")).toMatchObject({
      ok: true,
    });
  });

  it("stops at the limit", () => {
    const full: LocationSettings = {
      active: "gps",
      saved: Array.from({ length: MAX_SAVED_LOCATIONS }, (_, index) => ({
        id: String(index),
        label: String(index),
        latitude: index * 10,
        longitude: 0,
      })),
    };

    expect(addSavedLocation(full, rotterdam, "new")).toEqual({
      ok: false,
      reason: "limit",
    });
  });
});

describe("removeSavedLocation", () => {
  const settings: LocationSettings = {
    active: "a",
    saved: [
      { ...amsterdam, id: "a" },
      { ...rotterdam, id: "b" },
    ],
  };

  it("goes back to GPS when the active place is removed", () => {
    expect(removeSavedLocation(settings, "a")).toEqual({
      active: "gps",
      saved: [{ ...rotterdam, id: "b" }],
    });
  });

  it("keeps the active place when another is removed", () => {
    expect(removeSavedLocation(settings, "b")).toMatchObject({
      active: "a",
    });
  });
});

describe("setActiveLocation", () => {
  const settings: LocationSettings = {
    active: "gps",
    saved: [{ ...amsterdam, id: "a" }],
  };

  it("activates a saved place and remembers it", () => {
    expect(setActiveLocation(settings, "a")).toMatchObject({
      active: "a",
    });
  });

  it("keeps the remembered place when going back to GPS", () => {
    const active = setActiveLocation(settings, "a");

    expect(setActiveLocation(active, "gps")).toMatchObject({
      active: "gps",
    });
  });

  it("ignores an unknown id", () => {
    expect(setActiveLocation(settings, "gone")).toBe(settings);
  });
});
