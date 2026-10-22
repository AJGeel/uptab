import { describe, expect, it } from "vitest";

import { parseReleaseNotes } from "./parseReleaseNotes";

const changelog = `# Changelog

UpTab adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [V2.0.0] — 2026-10-21

### ✨ Added

- Choose your backgrounds

### ♻️ Changed

- All themes are on by default

## [V1.5.1] — 2026-10-17

### 🐛 Fixed

- The forecast no longer jumps in size
`;

describe("parseReleaseNotes", () => {
  it("returns the sections of one release, without the heading", () => {
    expect(parseReleaseNotes(changelog, "2.0.0")).toEqual({
      date: "2026-10-21",
      body: "### ✨ Added\n\n- Choose your backgrounds\n\n### ♻️ Changed\n\n- All themes are on by default",
    });
  });

  it("reads the last release, which has no heading after it", () => {
    expect(parseReleaseNotes(changelog, "1.5.1")?.body).toBe(
      "### 🐛 Fixed\n\n- The forecast no longer jumps in size",
    );
  });

  it("returns nothing for a version without a section", () => {
    expect(parseReleaseNotes(changelog, "9.9.9")).toBeUndefined();
    expect(parseReleaseNotes(changelog, "2.0")).toBeUndefined();
  });

  it("returns nothing for an empty section", () => {
    expect(
      parseReleaseNotes("## [V1.0.0] — 2026-01-01\n\n## [V0.9.0]\n", "1.0.0"),
    ).toBeUndefined();
  });

  it("copes with a missing date, a missing V and Windows line endings", () => {
    expect(
      parseReleaseNotes("## [1.2.3]\r\n\r\n- Something\r\n", "1.2.3"),
    ).toEqual({ date: null, body: "- Something" });
  });
});
