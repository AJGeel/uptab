import { create } from "zustand";

import { EggId } from "@/src/services/easterEggs/eggs";

type State = {
  /** Set by the dev tools in settings: plays this egg whatever the date or the odds. */
  forced?: { egg?: EggId };
};

type Actions = {
  forceEgg: (egg?: EggId) => void;
};

export const useEggStore = create<State & Actions>((set) => ({
  forced: undefined,
  // A new object each time, so picking the same egg again counts as a change.
  forceEgg: (egg) => set({ forced: { egg } }),
}));
