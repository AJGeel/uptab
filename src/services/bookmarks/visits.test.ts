import { describe, expect, it } from "vitest";

import { buildVisits, getVisit } from "./visits";

describe("buildVisits", () => {
  it("matches a bookmark to history despite a trailing slash", () => {
    const visits = buildVisits([
      { url: "https://a.example/", visitCount: 3, lastVisitTime: 100 },
    ]);

    expect(getVisit(visits, "https://a.example")).toEqual({
      visitCount: 3,
      lastVisitTime: 100,
    });
  });

  it("adds up pages that only differ in how the URL is written", () => {
    const visits = buildVisits([
      { url: "https://a.example", visitCount: 2, lastVisitTime: 300 },
      { url: "https://a.example/", visitCount: 5, lastVisitTime: 100 },
    ]);

    expect(getVisit(visits, "https://a.example/")).toEqual({
      visitCount: 7,
      lastVisitTime: 300,
    });
  });

  it("doesn't mix up different pages on a site", () => {
    const visits = buildVisits([
      { url: "https://a.example/page", visitCount: 4, lastVisitTime: 1 },
    ]);

    expect(getVisit(visits, "https://a.example")).toBeUndefined();
  });

  it("skips entries without a URL, and keeps URLs it can't parse as they are", () => {
    const visits = buildVisits([
      { visitCount: 1, lastVisitTime: 1 },
      { url: "not a url", visitCount: 2, lastVisitTime: 2 },
    ]);

    expect(getVisit(visits, "not a url")).toEqual({
      visitCount: 2,
      lastVisitTime: 2,
    });
  });

  it("treats missing counts as none", () => {
    const visits = buildVisits([{ url: "https://a.example" }]);

    expect(getVisit(visits, "https://a.example")).toEqual({
      visitCount: 0,
      lastVisitTime: 0,
    });
  });
});
