import { create } from "zustand";

type State = {
  isVisible: boolean;
};

type Action = {
  setIsVisible: (value: boolean) => void;
};

const useHotkeyModalStore = create<State & Action>()((set) => ({
  isVisible: false,
  setIsVisible: (value) => set({ isVisible: value }),
}));

export default useHotkeyModalStore;
