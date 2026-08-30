import { hotkeys } from "./hotkeys";

export type Hotkeys = (typeof hotkeys)[keyof typeof hotkeys];

export type HotkeyDescription = {
    keyDisplay: string;
    description: string;
};