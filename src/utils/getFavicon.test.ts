import { describe, expect, it } from "vitest";

import { getFavicon } from "./getFavicon";

describe("getFavicon", () => {
  it("should generate the correct favicon URL for a given input URL", () => {
    expect(getFavicon("https://example.com")).toBe(
      "https://www.google.com/s2/favicons?domain=https://example.com&sz=64"
    );
  });

  it("should handle different input URLs", () => {
    const inputUrls = [
      "https://site1.com",
      "https://site2.org",
      "https://site3.net",
    ];
    const expectedFaviconUrls = [
      "https://www.google.com/s2/favicons?domain=https://site1.com&sz=64",
      "https://www.google.com/s2/favicons?domain=https://site2.org&sz=64",
      "https://www.google.com/s2/favicons?domain=https://site3.net&sz=64",
    ];

    inputUrls.forEach((url, index) => {
      const result = getFavicon(url);
      expect(result).toBe(expectedFaviconUrls[index]);
    });
  });

  it("should handle special characters in the input URL", () => {
    const inputUrl = "https://site-with_special_characters.com";
    const expectedFaviconUrl =
      "https://www.google.com/s2/favicons?domain=https://site-with_special_characters.com&sz=64";

    const result = getFavicon(inputUrl);

    expect(result).toBe(expectedFaviconUrl);
  });

  it("should handle size params for a higher resolution", () => {
    const inputUrl = "https://site.com";

    expect(getFavicon(inputUrl)).toEqual(
      "https://www.google.com/s2/favicons?domain=https://site.com&sz=64"
    );
    expect(getFavicon(inputUrl, 16)).toEqual(
      "https://www.google.com/s2/favicons?domain=https://site.com&sz=16"
    );
    expect(getFavicon(inputUrl, 256)).toEqual(
      "https://www.google.com/s2/favicons?domain=https://site.com&sz=256"
    );
  });
});
