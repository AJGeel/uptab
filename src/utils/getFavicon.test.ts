import { describe, expect, it } from "vitest";

import { getFavicon } from "./getFavicon";

describe("getFavicon", () => {
  it("should generate the correct favicon URL for a given input URL", () => {
    expect(getFavicon("https://example.com")).toBe(
      "https://f1.allesedv.com/32/https://example.com"
    );
  });

  it("should handle different input URLs", () => {
    const inputUrls = [
      "https://site1.com",
      "https://site2.org",
      "https://site3.net",
    ];
    const expectedFaviconUrls = [
      "https://f1.allesedv.com/32/https://site1.com",
      "https://f1.allesedv.com/32/https://site2.org",
      "https://f1.allesedv.com/32/https://site3.net",
    ];

    inputUrls.forEach((url, index) => {
      const result = getFavicon(url);
      expect(result).toBe(expectedFaviconUrls[index]);
    });
  });

  it("should handle special characters in the input URL", () => {
    const inputUrl = "https://site-with_special_characters.com";
    const expectedFaviconUrl =
      "https://f1.allesedv.com/32/https://site-with_special_characters.com";

    const result = getFavicon(inputUrl);

    expect(result).toBe(expectedFaviconUrl);
  });
});
