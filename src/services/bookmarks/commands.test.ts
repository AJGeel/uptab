import { describe, expect, it } from "vitest";

import { findCommands } from "./commands";

const names = (query: string) => findCommands(query)?.map(({ name }) => name);

describe("findCommands", () => {
  it("lists every command after a lone colon", () => {
    expect(names(":")).toHaveLength(5);
  });

  it("narrows as the command is typed", () => {
    expect(names(":re")).toEqual(["recent", "rev"]);
    expect(names(": POP ")).toEqual(["popular"]);
  });

  it("takes a short form or a whole name as that command alone", () => {
    expect(names(":r")).toEqual(["recent"]);
    expect(names(":d")).toEqual(["date"]);
    expect(names(":n")).toEqual(["name"]);
    expect(names(":p")).toEqual(["popular"]);
    expect(names(":rev")).toEqual(["rev"]);
  });

  it("leaves everything else to the search", () => {
    for (const query of ["", "date", ":)", ":nope", "localhost:3000"]) {
      expect(findCommands(query)).toBeUndefined();
    }
  });

  it("goes to a sort, and flips it when it's already in use", () => {
    const date = findCommands(":d")?.[0];

    expect(date?.run("A-Z")).toBe("Newest");
    expect(date?.run("Newest")).toBe("Oldest");
    expect(date?.run("Oldest")).toBe("Newest");
    expect(findCommands(":rev")?.[0].run("Newest")).toBe("Oldest");
  });
});
