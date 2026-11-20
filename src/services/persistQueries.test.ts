import { describe, expect, it, vi } from "vitest";

vi.mock("webextension-polyfill", () => ({
  runtime: { getManifest: () => ({ version: "1.0.0" }) },
  storage: { local: {} },
}));

const { CALENDAR_PERSIST_DURATION, PERSIST_DURATION, dropOutdatedQueries } =
  await import("./persistQueries");

const now = 1_000_000_000_000;
const query = (key: string, age: number) =>
  ({
    queryKey: [key],
    queryHash: key,
    state: { dataUpdatedAt: now - age },
  }) as never;

const client = (...queries: unknown[]) =>
  ({
    timestamp: now,
    buster: "",
    clientState: { mutations: [], queries },
  }) as never;

const keysOf = (result: ReturnType<typeof dropOutdatedQueries>) =>
  result.clientState.queries.map(({ queryKey }) => queryKey[0]);

describe("dropOutdatedQueries", () => {
  it("keeps weather for minutes, but calendar events for a day", () => {
    const result = dropOutdatedQueries(
      client(
        query("weather", PERSIST_DURATION - 1),
        query("calendar", CALENDAR_PERSIST_DURATION - 1),
      ),
      now,
    );

    expect(keysOf(result)).toEqual(["weather", "calendar"]);
  });

  it("drops weather and location once they're too old, but not calendar events", () => {
    const age = PERSIST_DURATION + 1;
    const result = dropOutdatedQueries(
      client(
        query("weather", age),
        query("location", age),
        query("calendar", age),
      ),
      now,
    );

    expect(keysOf(result)).toEqual(["calendar"]);
  });

  it("drops calendar events after a day", () => {
    const result = dropOutdatedQueries(
      client(query("calendar", CALENDAR_PERSIST_DURATION + 1)),
      now,
    );

    expect(keysOf(result)).toEqual([]);
  });
});
