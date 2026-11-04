import { describe, expect, it } from "vitest";

import { safeHref } from "./safeHref";

describe("safeHref", () => {
  it("keeps normal links", () => {
    expect(safeHref("https://example.com/")).toBe("https://example.com/");
    expect(safeHref("chrome://settings")).toBe("chrome://settings");
    expect(safeHref(undefined)).toBeUndefined();
  });

  it.each([
    "javascript:alert(1)",
    "JavaScript:alert(1)",
    " java\tscript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
  ])("drops %s", (url) => {
    expect(safeHref(url)).toBeUndefined();
  });
});
