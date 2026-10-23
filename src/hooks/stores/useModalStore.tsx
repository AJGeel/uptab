import { create } from "zustand";

export const Modals = {
  hotkey: "hotkey",
  shortlink: "shortlink",
  settings: "settings",
  weather_forecast: "weatherForecast",
  backgrounds: "backgrounds",
  localPhotos: "localPhotos",
  whatsNew: "whatsNew",
} as const;

export type Modals = (typeof Modals)[keyof typeof Modals];

export type SettingsTab = "Sidebar" | "Homescreen" | "Backgrounds" | "Location";

type State = {
  activeModal: Modals | null;
  /** The tab the settings modal opens on, instead of the first. */
  settingsTab: SettingsTab | null;
};

type Actions = {
  setActiveModal: (to: Modals | null) => void;
  openSettingsTab: (tab: SettingsTab) => void;
};

export const useModalStore = create<State & Actions>()((set) => ({
  activeModal: null,
  settingsTab: null,
  setActiveModal: (value) => set({ activeModal: value, settingsTab: null }),
  openSettingsTab: (tab) =>
    set({ activeModal: Modals.settings, settingsTab: tab }),
}));
