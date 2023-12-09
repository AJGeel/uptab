import { create } from "zustand";

import { Shortlink } from "@/src/services/shortlinks";

type State = {
  selected: Shortlink | null;
};

type Actions = {
  setSelected: (to: Shortlink | null) => void;
};

export const useShortlinkStore = create<State & Actions>()((set) => ({
  selected: null,
  setSelected: (value) => set({ selected: value }),
}));
