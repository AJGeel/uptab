import { describe, expect, it } from "vitest";

import { getFavicon } from "./getFavicon";

describe("getFavicon", () => {
  it("should generate the correct favicon URL for a given input URL", () => {
    expect(getFavicon("https://example.com")).toBe(
      "https://www.google.com/s2/favicons?domain=https://example.com"
    );
  });

  it("should handle different input URLs", () => {
    const inputUrls = [
      "https://site1.com",
      "https://site2.org",
      "https://site3.net",
    ];
    const expectedFaviconUrls = [
      "https://www.google.com/s2/favicons?domain=https://site1.com",
      "https://www.google.com/s2/favicons?domain=https://site2.org",
      "https://www.google.com/s2/favicons?domain=https://site3.net",
    ];

    inputUrls.forEach((url, index) => {
      const result = getFavicon(url);
      expect(result).toBe(expectedFaviconUrls[index]);
    });
  });

  it("should handle special characters in the input URL", () => {
    const inputUrl = "https://site-with_special_characters.com";
    const expectedFaviconUrl =
      "https://www.google.com/s2/favicons?domain=https://site-with_special_characters.com";

    const result = getFavicon(inputUrl);

    expect(result).toBe(expectedFaviconUrl);
  });
});
