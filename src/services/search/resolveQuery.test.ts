import { describe, expect, it } from "vitest";

import { resolveQuery } from "./resolveQuery";
import { getSearchUrl } from "./searchEngines";

describe("resolveQuery", () => {
  it("opens a web address as typed", () => {
    expect(resolveQuery(" https://example.com/a?b=1 ", "duckduckgo")).toEqual({
      kind: "address",
      url: "https://example.com/a?b=1",
    });
  });

  it("adds https to a bare address", () => {
    for (const text of [
      "github.com/foo",
      "sub.example.co.uk",
      "localhost:3000/x",
      "192.168.0.1",
    ]) {
      expect(resolveQuery(text, "google")).toEqual({
        kind: "address",
        url: `https://${text}`,
      });
    }
  });

  it("searches for anything else", () => {
    expect(resolveQuery("best pizza near me", "duckduckgo")).toEqual({
      kind: "search",
      url: "https://duckduckgo.com/?q=best%20pizza%20near%20me",
    });
    expect(resolveQuery("react", "bing").kind).toBe("search");
  });

  it("never opens other schemes, searching for them instead", () => {
    for (const text of [
      "javascript:alert(document.cookie)",
      "data:text/html,hi.there",
      "file:///etc/passwd",
      "chrome://settings",
    ]) {
      expect(resolveQuery(text, "duckduckgo").kind).toBe("search");
    }
  });

  it("searches for text with spaces, even with a dot", () => {
    expect(resolveQuery("node.js tutorial", "duckduckgo").kind).toBe("search");
  });
});

describe("getSearchUrl", () => {
  it("encodes the query for each engine", () => {
    expect(getSearchUrl("google", "a&b c")).toBe(
      "https://www.google.com/search?q=a%26b%20c",
    );
  });
});
