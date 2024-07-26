export const bgThemes = {
  holland: "holland",
  abstract: "abstract",
  underwater: "underwater",
  safari: "safari",
} as const;

export type BgTheme = (typeof bgThemes)[keyof typeof bgThemes];
