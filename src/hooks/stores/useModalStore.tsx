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

export type SettingsSection =
  "sidebar" | "homescreen" | "photos" | "weather" | "time" | "appearance";

type State = {
  activeModal: Modals | null;
  /** The section the settings modal opens on, instead of the first. */
  settingsSection: SettingsSection | null;
};

type Actions = {
  setActiveModal: (to: Modals | null) => void;
  openSettingsSection: (section: SettingsSection) => void;
};

export const useModalStore = create<State & Actions>()((set) => ({
  activeModal: null,
  settingsSection: null,
  setActiveModal: (value) => set({ activeModal: value, settingsSection: null }),
  openSettingsSection: (section) =>
    set({ activeModal: Modals.settings, settingsSection: section }),
}));
