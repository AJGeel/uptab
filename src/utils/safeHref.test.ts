import { describe, expect, it } from "vitest";

import { safeHref } from "./safeHref";

describe("safeHref", () => {
  it("keeps web links", () => {
    expect(safeHref("https://example.com/")).toBe("https://example.com/");
    expect(safeHref("HTTP://example.com/")).toBe("HTTP://example.com/");
  });

  it.each([
    undefined,
    "",
    "javascript:alert(1)",
    "JavaScript:alert(1)",
    " java\tscript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "chrome://settings",
  ])("drops %s", (url) => {
    expect(safeHref(url)).toBeUndefined();
  });
});
