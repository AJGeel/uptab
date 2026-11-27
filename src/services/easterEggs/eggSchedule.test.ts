import { describe, expect, it } from "vitest";

import { getEggSchedule } from "./eggSchedule";

describe("getEggSchedule", () => {
  const schedule = getEggSchedule(2026);
  const of = (egg: string) => schedule.find((item) => item.egg === egg);

  it("lists every egg once, by the day it starts on", () => {
    expect(schedule.map(({ egg }) => egg)).toEqual([
      "Koningsdag",
      "Bevrijdingsdag",
      /*
       * TODO(sint-maarten): comes after Bevrijdingsdag when it's back.
       * "Sint-Maarten",
       */
      "Sinterklaas",
      "Christmas",
      "Oud & Nieuw",
    ]);
  });

  it("has a row for every range, with its own odds", () => {
    expect(of("Sinterklaas")?.rows).toEqual([
      { dates: "15 Nov–1 Dec", chance: 0.05 },
      { dates: "2–4 Dec", chance: 0.25 },
      { dates: "5 Dec", chance: 1 },
    ]);
    expect(of("Bevrijdingsdag")?.rows).toEqual([
      { dates: "5 May", chance: 0.4 },
    ]);
  });

  it("puts 1 January last for the turn of the year", () => {
    expect(of("Oud & Nieuw")?.rows.map(({ dates }) => dates)).toEqual([
      "30 Dec",
      "31 Dec",
      "1 Jan",
    ]);
  });
});
