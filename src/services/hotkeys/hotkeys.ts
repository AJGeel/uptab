import { HotkeyDescription, Hotkeys } from "./types";

export const hotkeys = {
  slash: "/",
  comma: ",",
  backslash: "\\",
  questionMark: "?",
  left: "ArrowLeft",
  right: "ArrowRight",
  b: "b",
  l: "l",
} as const;

export const hotkeyDescriptions: Record<Hotkeys, HotkeyDescription> = {
  [hotkeys.slash]: {
    keyDisplay: "/",
    description: "Search your bookmarks",
  },
  [hotkeys.comma]: {
    keyDisplay: ",",
    description: "View/hide the settings menu",
  },
  [hotkeys.backslash]: {
    keyDisplay: "\\",
    description: "Toggle sidebar visibility",
  },
  [hotkeys.questionMark]: {
    keyDisplay: "?",
    description: "View/hide the keyboard shortcuts",
  },
  [hotkeys.left]: {
    keyDisplay: "←",
    description: "Previous background",
  },
  [hotkeys.right]: {
    keyDisplay: "→",
    description: "Next background",
  },
  [hotkeys.b]: {
    keyDisplay: "B",
    description: "Choose backgrounds",
  },
  [hotkeys.l]: {
    keyDisplay: "L",
    description: "Open look & feel",
  },
};
