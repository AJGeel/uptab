import { HotkeyDescription, Hotkeys } from "./types";

export const hotkeys = {
    slash: "/",
    backslash: "\\",
    questionMark: "?",
    left: "ArrowLeft",
    right: "ArrowRight",
} as const;

export const hotkeyDescriptions: Record<Hotkeys, HotkeyDescription> = {
    [hotkeys.slash]: {
        keyDisplay: "/",
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
};