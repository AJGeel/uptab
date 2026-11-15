import type { ErrorEvent } from "@sentry/browser";
import { describe, expect, it } from "vitest";

import { scrubEvent, scrubString } from "./scrub";

describe("scrubString", () => {
  it("replaces web addresses, with their queries", () => {
    expect(
      scrubString(
        "Failed: https://api.open-meteo.com/v1/forecast?latitude=52.37&longitude=4.9 (500)",
      ),
    ).toBe("Failed: [url] (500)");
  });

  it("drops the extension's origin but keeps the file path", () => {
    expect(
      scrubString("chrome-extension://abcdef/src/pages/newtab/index.js"),
    ).toBe("/src/pages/newtab/index.js");
    expect(scrubString("moz-extension://1234-5678/assets/a.js")).toBe(
      "/assets/a.js",
    );
  });

  it("redacts coordinates written as values", () => {
    expect(scrubString('{"latitude": 52.37, "lon":4.9}')).toBe(
      '{"latitude": [redacted], "lon":[redacted]}',
    );
  });

  it("leaves other text alone", () => {
    expect(scrubString("Cannot read properties of undefined")).toBe(
      "Cannot read properties of undefined",
    );
  });
});

describe("scrubEvent", () => {
  it("removes the request and user, and scrubs the rest", () => {
    const event = {
      type: undefined,
      message: "Nope: https://nominatim.openstreetmap.org/reverse?lat=1&lon=2",
      request: { url: "chrome-extension://abc/newtab.html" },
      user: { ip_address: "{{auto}}" },
      breadcrumbs: [
        { category: "fetch", data: { url: "https://example.com/?q=secret" } },
      ],
      exception: {
        values: [
          {
            value: "Failed to fetch https://example.com/a",
            stacktrace: {
              frames: [{ filename: "chrome-extension://abc/src/a.js" }],
            },
          },
        ],
      },
    } as unknown as ErrorEvent;

    const scrubbed = scrubEvent(event);

    expect(scrubbed.request).toBeUndefined();
    expect(scrubbed.user).toBeUndefined();
    expect(JSON.stringify(scrubbed)).not.toMatch(/https?:|secret|nominatim/);
    expect(
      scrubbed.exception?.values?.[0].stacktrace?.frames?.[0].filename,
    ).toBe("/src/a.js");
  });
});
