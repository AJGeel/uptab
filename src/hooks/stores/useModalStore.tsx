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

/** Something in the settings modal to focus when it opens, instead of the first field. */
export type SettingsFocus = "citySearch";

export type SettingsSection =
  | "sidebar"
  | "homescreen"
  | "photos"
  | "location"
  | "weather"
  | "appearance"
  | "general";

type State = {
  activeModal: Modals | null;
  /** The section the settings modal opens on, instead of the first. */
  settingsSection: SettingsSection | null;
  settingsFocus: SettingsFocus | null;
  /** The modals to go back to, nearest last, when the current one is closed. */
  trail: Modals[];
};

type Actions = {
  setActiveModal: (to: Modals | null) => void;
  /** Opens a modal from another one, so closing it comes back to that one. */
  openModal: (modal: Modals) => void;
  /** Closes the current modal, returning to the one it was opened from. */
  closeModal: () => void;
  openSettingsSection: (
    section: SettingsSection,
    focus?: SettingsFocus,
  ) => void;
};

export const useModalStore = create<State & Actions>()((set) => ({
  activeModal: null,
  settingsSection: null,
  settingsFocus: null,
  trail: [],
  setActiveModal: (value) =>
    set({
      activeModal: value,
      settingsSection: null,
      settingsFocus: null,
      trail: [],
    }),
  openModal: (modal) =>
    set((state) => ({
      activeModal: modal,
      trail: state.activeModal ? [...state.trail, state.activeModal] : [],
    })),
  closeModal: () =>
    set((state) => ({
      activeModal: state.trail.at(-1) ?? null,
      trail: state.trail.slice(0, -1),
      settingsSection: state.trail.length > 0 ? state.settingsSection : null,
      settingsFocus: state.trail.length > 0 ? state.settingsFocus : null,
    })),
  openSettingsSection: (section, focus) =>
    set((state) => {
      const { activeModal, trail } = state;
      const settingsAt = trail.indexOf(Modals.settings);
      const next =
        settingsAt >= 0
          ? trail.slice(0, settingsAt)
          : activeModal && activeModal !== Modals.settings
            ? [...trail, activeModal]
            : trail;

      return {
        activeModal: Modals.settings,
        settingsSection: section,
        settingsFocus: focus ?? null,
        trail: next,
      };
    }),
}));
