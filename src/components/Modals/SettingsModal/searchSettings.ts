import { SettingEntry, Section } from "./settingsRegistry";

const words = (query: string) =>
  query.toLowerCase().split(/\s+/).filter(Boolean);

/** The entries that contain every word of the query, in their original order. */
export const searchSettings = (
  entries: SettingEntry[],
  sections: Section[],
  query: string,
) => {
  const queryWords = words(query);

  if (queryWords.length === 0) {
    return entries;
  }

  return entries.filter((entry) => {
    const sectionLabel =
      sections.find(({ id }) => id === entry.section)?.label ?? "";
    const haystack = [
      entry.title,
      entry.description,
      sectionLabel,
      ...entry.keywords,
    ]
      .join(" ")
      .toLowerCase();

    return queryWords.every((word) => haystack.includes(word));
  });
};

export type TextPart = { text: string; isMatch: boolean };

/** Splits the text at every place a word of the query occurs, to highlight those. */
export const highlightParts = (text: string, query: string): TextPart[] => {
  const queryWords = words(query);

  if (queryWords.length === 0) {
    return [{ text, isMatch: false }];
  }

  const escaped = queryWords.map((word) =>
    word.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`),
  );
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");

  // With a capture group, split puts the matches at the odd positions.
  return text
    .split(pattern)
    .map((part, index) => ({ text: part, isMatch: index % 2 === 1 }))
    .filter(({ text: part }) => part);
};
