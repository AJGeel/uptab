import { create } from "zustand";

export const Modals = {
  hotkey: "hotkey",
  shortlink: "shortlink",
} as const;

export type Modals = (typeof Modals)[keyof typeof Modals];

type State = {
  activeModal: Modals | null;
};

type Actions = {
  setActiveModal: (to: Modals | null) => void;
};

export const useModalStore = create<State & Actions>()((set) => ({
  activeModal: null,
  setActiveModal: (value) => set({ activeModal: value }),
}));
