import { create } from "zustand";

import { EggId } from "@/src/services/easterEggs/eggs";

type State = {
  /** Set by the dev tools in settings: plays this egg whatever the date or the odds. */
  forced?: { egg?: EggId };
  /** The egg that's playing in this tab, if any: it has taken over the photo. */
  activeEgg?: EggId;
};

type Actions = {
  forceEgg: (egg?: EggId) => void;
  setActiveEgg: (egg?: EggId) => void;
};

export const useEggStore = create<State & Actions>((set) => ({
  forced: undefined,
  activeEgg: undefined,
  // A new object each time, so picking the same egg again counts as a change.
  forceEgg: (egg) => set({ forced: { egg } }),
  setActiveEgg: (egg) => set({ activeEgg: egg }),
}));
