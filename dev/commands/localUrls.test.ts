import { mkdtempSync, mkdirSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

import { describe, expect, it } from "vitest";

import { findLocalUrl, findLocalUrlInBuild } from "./localUrls";

describe("findLocalUrl", () => {
  it.each([
    'fetch("http://localhost:3000/backgrounds/v1/catalogue.json")',
    "https://localhost/catalogue.json",
    "ws://localhost:5173/",
    "http://127.0.0.1:8080/x",
    "http://[::1]:3000/x",
  ])("finds %s", (content) => {
    expect(findLocalUrl(content)).toBeDefined();
  });

  it.each([
    // Real strings from Sentry and the Markdown library in the builds.
    "a===`localhost`||a===`127.0.0.1`",
    "sentry.is_localhost",
    'File URL host must be "localhost" or empty on darwin',
    "https://uptab.vercel.app/backgrounds/v1/catalogue.json",
    "https://notlocalhost.example.com/x",
    "https://localhost.example.com/x",
  ])("ignores %s", (content) => {
    expect(findLocalUrl(content)).toBeUndefined();
  });

  it("returns the text around the match", () => {
    expect(
      findLocalUrl('const url = "http://localhost:3000/c.json";'),
    ).toContain("http://localhost:3000");
  });
});

describe("findLocalUrlInBuild", () => {
  const build = (files: Record<string, string>) => {
    const dir = mkdtempSync(join(tmpdir(), "uptab-build-"));

    for (const [name, content] of Object.entries(files)) {
      mkdirSync(join(dir, name, ".."), { recursive: true });
      writeFileSync(join(dir, name), content);
    }

    return dir;
  };

  it("names the file in a nested folder", () => {
    const dir = build({
      "manifest.json": "{}",
      "src/pages/newtab/index.js": 'x("http://localhost:3000/c.json")',
    });

    expect(findLocalUrlInBuild(dir)?.file).toBe("src/pages/newtab/index.js");
  });

  it("passes a clean build, and skips images", () => {
    const dir = build({
      "manifest.json": "{}",
      "assets/app.js": "a===`localhost`",
      "icon.png": "http://localhost:3000/",
    });

    expect(findLocalUrlInBuild(dir)).toBeUndefined();
  });
});
