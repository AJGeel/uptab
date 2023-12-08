import { create } from "zustand";

export const ActiveModal = {
  HOTKEY: "HOTKEY",
  SHORTLINK: "SHORTLINK",
} as const;

type State = {
  activeModal: keyof typeof ActiveModal | null;
};

type Actions = {
  setActiveModal: (to: keyof typeof ActiveModal | null) => void;
};

export const useModalStore = create<State & Actions>()((set) => ({
  activeModal: null,
  setActiveModal: (value) => set({ activeModal: value }),
}));

export default useModalStore;
