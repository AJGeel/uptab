import { describe, expect, it } from "vitest";

import { normalizeUrl } from "./normalizeUrl";

describe("normalizeUrl", () => {
  it('should add "https://" as default protocol if missing', () => {
    const result = normalizeUrl("example.com");

    expect(result).toBe("https://example.com/");
  });

  it('should not modify the URL if "http://" is already present', () => {
    const inputUrl = "http://example.com/";

    const result = normalizeUrl(inputUrl);

    expect(result).toBe(inputUrl);
  });

  it('should not modify the URL if "https://" is already present', () => {
    const inputUrl = "https://example.com/";

    const result = normalizeUrl(inputUrl);

    expect(result).toBe(inputUrl);
  });

  it('should remove "www." from the beginning of the hostname', () => {
    const inputUrl = "https://www.example.com";
    const expectedNormalizedUrl = "https://example.com/";

    const result = normalizeUrl(inputUrl);

    expect(result).toBe(expectedNormalizedUrl);
  });
});
