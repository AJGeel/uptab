import { create } from "zustand";

import type { DebugState } from "@/src/services/calendar/debugView";

/** TEMPORARY: the state the calendar widget is forced into, or null for the real one. */
export const useCalendarDebugStore = create<{
  state: DebugState | null;
  setState: (state: DebugState | null) => void;
}>()((set) => ({
  state: null,
  setState: (state) => set({ state }),
}));
