import { describe, expect, it } from "vitest";

import { isEmoji, isImageUrl, validateIcon } from "./icon";

describe("isEmoji", () => {
  it.each(["😀", "🚀", "👍🏽", "🇳🇱", "1️⃣", "👨‍👩‍👧"])("accepts %s", (icon) => {
    expect(isEmoji(icon)).toBe(true);
  });

  it.each(["", "a", "😀😀", "😀a", "https://a.com/a.png"])(
    "rejects %j",
    (icon) => {
      expect(isEmoji(icon)).toBe(false);
    },
  );
});

describe("isImageUrl", () => {
  it("accepts web and data image URLs only", () => {
    expect(isImageUrl("https://a.com/a.png")).toBe(true);
    expect(isImageUrl("data:image/png;base64,AAAA")).toBe(true);
    expect(isImageUrl("javascript:alert(1)")).toBe(false);
    expect(isImageUrl("😀")).toBe(false);
  });
});

describe("validateIcon", () => {
  it("accepts nothing, an emoji or an image URL", () => {
    expect(validateIcon("")).toBe(true);
    expect(validateIcon("  ")).toBe(true);
    expect(validateIcon("🚀")).toBe(true);
    expect(validateIcon(" https://a.com/a.png ")).toBe(true);
  });

  it("explains anything else", () => {
    expect(validateIcon("rocket")).toBe(
      "Enter an image URL or choose an emoji",
    );
    expect(validateIcon("https://")).toBe(
      "Enter an image URL or choose an emoji",
    );
  });
});
