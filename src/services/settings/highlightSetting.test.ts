import { beforeEach, describe, expect, it, vi } from "vitest";

import { highlightSetting } from "./highlightSetting";

type FakeElement = {
  settings: string[];
  highlighted: boolean;
  setAttribute: (name: string) => void;
  removeAttribute: (name: string) => void;
};

const element = (...settings: string[]): FakeElement => ({
  settings,
  highlighted: false,
  setAttribute() {
    this.highlighted = true;
  },
  removeAttribute() {
    this.highlighted = false;
  },
});

let elements: FakeElement[];

beforeEach(() => {
  elements = [
    element("sidebar.showBookmarks"),
    element("sidebar.showShortlinks", "sidebar.shortlinkColumns"),
    element("homescreen.showInfoWidget"),
  ];
  vi.stubGlobal("document", {
    querySelectorAll: (selector: string) => {
      if (selector === "[data-setting-hover]") {
        return elements.filter((item) => item.highlighted);
      }

      const id = selector.match(/~="(.+)"/)?.[1];

      return elements.filter((item) => id && item.settings.includes(id));
    },
  });
});

describe("highlightSetting", () => {
  it("highlights the elements that belong to the setting", () => {
    highlightSetting("sidebar.shortlinkColumns");

    expect(elements.map((item) => item.highlighted)).toEqual([
      false,
      true,
      false,
    ]);
  });

  it("moves the highlight to the next setting", () => {
    highlightSetting("sidebar.showBookmarks");
    highlightSetting("homescreen.showInfoWidget");

    expect(elements.map((item) => item.highlighted)).toEqual([
      false,
      false,
      true,
    ]);
  });

  it("clears it without a setting", () => {
    highlightSetting("sidebar.showBookmarks");
    highlightSetting(null);

    expect(elements.some((item) => item.highlighted)).toBe(false);
  });
});
