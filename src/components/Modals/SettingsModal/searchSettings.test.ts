import { describe, expect, it } from "vitest";

import { highlightParts, searchSettings } from "./searchSettings";
import { sections, settingEntries } from "./settingsRegistry";

const titles = (query: string) =>
  searchSettings(settingEntries, sections, query).map(({ id }) => id);

describe("searchSettings", () => {
  it("returns everything for an empty query", () => {
    expect(titles("  ")).toEqual(settingEntries.map(({ id }) => id));
  });

  it("matches on the title, ignoring case", () => {
    expect(titles("BOOKMARKS")).toContain("sidebar.showBookmarks");
  });

  it("matches on keywords and the section's name", () => {
    expect(titles("gps")).toEqual(["weather.location"]);
    expect(titles("homescreen")).toContain("homescreen.showPhotoCredit");
  });

  it("needs every word to match", () => {
    expect(titles("photo credit")).toEqual(["homescreen.showPhotoCredit"]);
    expect(titles("photo zebra")).toEqual([]);
  });
});

describe("highlightParts", () => {
  it("marks the words that match, whatever their case", () => {
    expect(highlightParts("Photo credit", "CRED")).toEqual([
      { text: "Photo ", isMatch: false },
      { text: "cred", isMatch: true },
      { text: "it", isMatch: false },
    ]);
  });

  it("returns the text as it is without a query", () => {
    expect(highlightParts("Photo credit", " ")).toEqual([
      { text: "Photo credit", isMatch: false },
    ]);
  });

  it("treats special characters as plain text", () => {
    expect(highlightParts("What's new (soon)", "(soon")).toEqual([
      { text: "What's new ", isMatch: false },
      { text: "(soon", isMatch: true },
      { text: ")", isMatch: false },
    ]);
  });
});
