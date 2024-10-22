import { describe, it, expect } from "vitest";

import { organiseHistory } from "./organiseHistory";
import { HistoryItem } from "./types";

describe("organiseHistory", () => {
  it("should return an empty map when there is no history", () => {
    const history: HistoryItem[] = [];
    const result = organiseHistory(history);
    expect(result.size).toBe(0);
  });

  it("should group history entries across multiple days correctly", () => {
    const history: HistoryItem[] = [
      { id: "1", lastVisitTime: new Date("2024-10-17T00:00:00Z").getTime() },
      { id: "2", lastVisitTime: new Date("2024-10-18T00:00:00Z").getTime() },
      { id: "3", lastVisitTime: new Date("2024-10-19T00:00:00Z").getTime() },
    ];
    const result = organiseHistory(history);
    expect(result.size).toBe(3);
    expect(result.has("2024-10-19")).toBe(true);
    expect(result.has("2024-10-18")).toBe(true);
    expect(result.has("2024-10-17")).toBe(true);
  });

  it("should group multiple entries for a single day correctly", () => {
    const history: HistoryItem[] = [
      { id: "1", lastVisitTime: new Date("2024-10-17T00:00:00Z").getTime() },
      { id: "2", lastVisitTime: new Date("2024-10-17T01:00:00Z").getTime() },
      { id: "3", lastVisitTime: new Date("2024-10-17T02:00:00Z").getTime() },
      { id: "4", lastVisitTime: new Date("2024-10-17T02:34:00Z").getTime() },
    ];
    const result = organiseHistory(history);
    expect(result.size).toBe(1);
    expect(result.get("2024-10-17")?.size).toBe(3);

    const hours = result.get("2024-10-17");

    expect(hours?.has("00")).toBe(true);
    expect(hours?.has("01")).toBe(true);
    expect(hours?.has("02")).toBe(true);
    expect(hours?.get("02")?.length).toBe(2);
  });
});
