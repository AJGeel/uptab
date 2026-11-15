import { getSortField, reverseSort, SortMode } from "./sortBookmarks";

export type Command = {
  /** What follows the colon. */
  name: string;
  /** A shorter way to type it. */
  short?: string;
  description: string;
  /** The sort it leads to. */
  run: (current: SortMode) => SortMode;
};

export const COMMAND_PREFIX = ":";

/** Goes to the sort, or flips its direction when it's already the one in use. */
const sortBy = (mode: SortMode) => (current: SortMode) =>
  getSortField(current) === getSortField(mode) ? reverseSort(current) : mode;

export const commands: Command[] = [
  { name: "name", short: "n", description: "Sort by name", run: sortBy("A-Z") },
  {
    name: "date",
    short: "d",
    description: "Sort by date added",
    run: sortBy("Newest"),
  },
  {
    name: "recent",
    short: "r",
    description: "Sort by recently visited",
    run: sortBy("Recent"),
  },
  {
    name: "popular",
    short: "p",
    description: "Sort by most visited",
    run: sortBy("Popular"),
  },
  { name: "rev", description: "Reverse the sort", run: reverseSort },
];

/**
 * The commands a query starts to spell, typed after a colon. `undefined` when it
 * isn't one, so it's searched for like any other text.
 */
export const findCommands = (query: string): Command[] | undefined => {
  if (!query.startsWith(COMMAND_PREFIX)) {
    return undefined;
  }

  const typed = query.slice(1).trim().toLowerCase().replace(/\s+/g, " ");
  // A whole name or short form is that command alone: `:r` is recent, not rev.
  const exact = commands.find(
    ({ name, short }) => name === typed || short === typed,
  );
  const matches = exact
    ? [exact]
    : commands.filter(({ name }) => name.startsWith(typed));

  return matches.length > 0 ? matches : undefined;
};
