import { describe, it, expect } from "vitest";

import { getHoursWithHistory } from "./getHoursWithHistory";
import { OrganisedHistory } from "./types";

describe("getHoursWithHistory", () => {
  it("should return an empty array if no history is provided", () => {
    const result = getHoursWithHistory(undefined, "2024-10-18");
    expect(result).toEqual([]);
  });

  it("should return an empty array if no active day is provided", () => {
    const organisedHistory: OrganisedHistory = new Map();
    const result = getHoursWithHistory(organisedHistory, undefined);
    expect(result).toEqual([]);
  });

  it("should return an empty array if the active day does not exist in history", () => {
    const organisedHistory: OrganisedHistory = new Map([
      [
        "2024-10-18",
        new Map([
          ["10", [{ id: "1" }]],
          ["11", [{ id: "2" }]],
        ]),
      ],
      ["2024-10-19", new Map([["12", [{ id: "3" }]]])],
    ]);

    const result = getHoursWithHistory(organisedHistory, "2024-10-20");
    expect(result).toEqual([]);
  });

  it("should return the correct hours for a valid active day", () => {
    const organisedHistory: OrganisedHistory = new Map([
      [
        "2024-10-18",
        new Map([
          ["10", [{ id: "1" }]],
          ["11", [{ id: "2" }]],
        ]),
      ],
      ["2024-10-19", new Map([["12", [{ id: "3" }]]])],
    ]);

    const result = getHoursWithHistory(organisedHistory, "2024-10-18");
    expect(result).toEqual(["10", "11"]);
  });

  it("should return the correct hours for another valid active day", () => {
    const organisedHistory: OrganisedHistory = new Map([
      [
        "2024-10-18",
        new Map([
          ["10", [{ id: "1" }]],
          ["11", [{ id: "2" }]],
        ]),
      ],
      ["2024-10-19", new Map([["12", [{ id: "3" }]]])],
    ]);

    const result = getHoursWithHistory(organisedHistory, "2024-10-19");
    expect(result).toEqual(["12"]);
  });
});
