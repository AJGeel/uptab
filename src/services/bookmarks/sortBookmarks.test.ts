import { describe, expect, it } from "vitest";
import { Bookmarks } from "webextension-polyfill";

import {
  getSortField,
  reverseSort,
  SortFields,
  sortBookmarks,
} from "./sortBookmarks";
import { buildVisits } from "./visits";

type Node = Bookmarks.BookmarkTreeNode;

const bookmark = (title: string, dateAdded = 0): Node => ({
  id: title,
  title,
  url: `https://${title.toLowerCase()}.example`,
  dateAdded,
});

const titles = (nodes: Node[]) => nodes.map((node) => node.title);

const list = [
  bookmark("Cherry", 1),
  bookmark("Apple", 3),
  bookmark("Banana", 2),
  bookmark("Durian", 4),
];

describe("sortBookmarks", () => {
  it("sorts by name and by date added", () => {
    expect(titles(sortBookmarks([...list], "A-Z"))).toEqual([
      "Apple",
      "Banana",
      "Cherry",
      "Durian",
    ]);
    expect(titles(sortBookmarks([...list], "Z-A"))).toEqual([
      "Durian",
      "Cherry",
      "Banana",
      "Apple",
    ]);
    expect(titles(sortBookmarks([...list], "Newest"))).toEqual([
      "Durian",
      "Apple",
      "Banana",
      "Cherry",
    ]);
    expect(titles(sortBookmarks([...list], "Oldest"))).toEqual([
      "Cherry",
      "Banana",
      "Apple",
      "Durian",
    ]);
  });

  describe("by visits", () => {
    const visits = buildVisits([
      { url: "https://cherry.example/", visitCount: 9, lastVisitTime: 10 },
      { url: "https://apple.example/", visitCount: 2, lastVisitTime: 50 },
      { url: "https://banana.example/", visitCount: 9, lastVisitTime: 30 },
    ]);

    it("puts the most recently visited first, and unvisited last", () => {
      expect(titles(sortBookmarks([...list], "Recent", visits))).toEqual([
        "Apple",
        "Banana",
        "Cherry",
        "Durian",
      ]);
    });

    it("puts the most visited first, the more recent winning a tie", () => {
      expect(titles(sortBookmarks([...list], "Popular", visits))).toEqual([
        "Banana",
        "Cherry",
        "Apple",
        "Durian",
      ]);
    });

    it("orders the unvisited by name", () => {
      const none = buildVisits([]);

      expect(titles(sortBookmarks([...list], "Popular", none))).toEqual([
        "Apple",
        "Banana",
        "Cherry",
        "Durian",
      ]);
    });

    it("falls back to name without visit data", () => {
      expect(titles(sortBookmarks([...list], "Popular"))).toEqual([
        "Apple",
        "Banana",
        "Cherry",
        "Durian",
      ]);
    });
  });
});

describe("getSortField", () => {
  it("groups the two directions of a sort", () => {
    expect(getSortField("A-Z")).toBe("Name");
    expect(getSortField("Z-A")).toBe("Name");
    expect(getSortField("Newest")).toBe("Date");
    expect(getSortField("Oldest")).toBe("Date");
    expect(getSortField("Recent")).toBe("Recent");
    expect(getSortField("Popular")).toBe("Popular");
  });
});

describe("reverseSort", () => {
  it("flips name and date sorts", () => {
    expect(reverseSort("A-Z")).toBe("Z-A");
    expect(reverseSort("Z-A")).toBe("A-Z");
    expect(reverseSort("Newest")).toBe("Oldest");
    expect(reverseSort("Oldest")).toBe("Newest");
  });

  it("leaves the visit sorts, which only make sense one way", () => {
    expect(reverseSort("Recent")).toBe("Recent");
    expect(reverseSort("Popular")).toBe("Popular");
  });
});

describe("SortFields", () => {
  it("starts each field in its natural direction", () => {
    expect(SortFields.map(({ mode }) => mode)).toEqual([
      "A-Z",
      "Newest",
      "Recent",
      "Popular",
    ]);
  });

  it("keeps every saved sort reachable from a field", () => {
    const fields = SortFields.map(({ field }) => field);

    (["A-Z", "Z-A", "Newest", "Oldest", "Recent", "Popular"] as const).forEach(
      (mode) => expect(fields).toContain(getSortField(mode)),
    );
  });
});
