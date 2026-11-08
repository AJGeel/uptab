import { describe, expect, it } from "vitest";

import { buildFeedbackUrl } from "./feedbackUrl";

const chromeMac =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36";
const edgeWindows =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.3719.82";
const operaLinux =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 OPR/115.0.0.0";
const firefoxWindows =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:144.0) Gecko/20100101 Firefox/144.0";

const params = (url: string) => new URL(url).searchParams;

describe("buildFeedbackUrl", () => {
  it("points at the feedback form on the site", () => {
    const url = new URL(buildFeedbackUrl("1.4.0", chromeMac));

    expect(url.origin).toBe("https://uptab.vercel.app");
    expect(url.pathname).toBe("/feedback");
  });

  it("encodes the middle dot and the spaces", () => {
    const url = buildFeedbackUrl("1.4.0", chromeMac);

    expect(url).toContain("v=1.4.0");
    expect(url).toContain("browser=Chrome+144+%C2%B7+macOS");
    expect(params(url).get("browser")).toBe("Chrome 144 · macOS");
  });

  it("omits the browser when it can't be detected", () => {
    expect(params(buildFeedbackUrl("1.4.0", "")).has("browser")).toBe(false);
    expect(params(buildFeedbackUrl("1.4.0", "curl/8.0")).has("browser")).toBe(
      false,
    );
    expect(
      params(buildFeedbackUrl("1.4.0", "Chrome/144.0.0.0")).has("browser"),
    ).toBe(false);
  });

  it("doesn't report Edge or Opera as Chrome", () => {
    expect(params(buildFeedbackUrl("1.4.0", edgeWindows)).get("browser")).toBe(
      "Edge 144 · Windows",
    );
    expect(params(buildFeedbackUrl("1.4.0", operaLinux)).get("browser")).toBe(
      "Opera 115 · Linux",
    );
  });

  it("detects Firefox", () => {
    expect(
      params(buildFeedbackUrl("1.4.0", firefoxWindows)).get("browser"),
    ).toBe("Firefox 144 · Windows");
  });

  it("detects Android before Linux", () => {
    const android =
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36";

    expect(params(buildFeedbackUrl("1.4.0", android)).get("browser")).toBe(
      "Chrome 144 · Android",
    );
  });

  it("strips a leading v from the version", () => {
    expect(params(buildFeedbackUrl("v1.4.0", chromeMac)).get("v")).toBe(
      "1.4.0",
    );
  });

  it("drops a version the site would reject", () => {
    expect(params(buildFeedbackUrl("1.4 beta", chromeMac)).has("v")).toBe(
      false,
    );
    expect(params(buildFeedbackUrl("1".repeat(33), chromeMac)).has("v")).toBe(
      false,
    );
  });
});
