import { Shortlink } from "@src/services/shortlinks";
import { create } from "zustand";

type State = {
  isVisible: boolean;
  selectedShortlink: Shortlink | null;
};

type Action = {
  setIsVisible: (value: boolean) => void;
  setSelectedShortlink: (item: Shortlink) => void;
  resetSelectedShortlink: () => void;
};

const useModalStore = create<State & Action>()((set) => ({
  isVisible: false,
  selectedShortlink: null,
  setIsVisible: (value) => set({ isVisible: value }),
  setSelectedShortlink: (item) => set(() => ({ selectedShortlink: item })),
  resetSelectedShortlink: () => set({ selectedShortlink: null }),
}));

export default useModalStore;
