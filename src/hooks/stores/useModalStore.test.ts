import { beforeEach, describe, expect, it } from "vitest";

import { Modals, useModalStore } from "./useModalStore";

const store = () => useModalStore.getState();

describe("useModalStore", () => {
  beforeEach(() => store().setActiveModal(null));

  it("returns to the settings after closing a modal opened from them", () => {
    store().openSettingsSection("photos");
    store().openModal(Modals.localPhotos);
    store().closeModal();

    expect(store().activeModal).toBe(Modals.settings);
    expect(store().settingsSection).toBe("photos");
  });

  it("walks back through every modal on the way", () => {
    store().setActiveModal(Modals.settings);
    store().openModal(Modals.backgrounds);
    store().openModal(Modals.localPhotos);

    store().closeModal();
    expect(store().activeModal).toBe(Modals.backgrounds);

    store().closeModal();
    expect(store().activeModal).toBe(Modals.settings);

    store().closeModal();
    expect(store().activeModal).toBeNull();
  });

  it("closes outright when nothing opened it", () => {
    store().setActiveModal(Modals.backgrounds);
    store().closeModal();

    expect(store().activeModal).toBeNull();
  });
});

describe("opening the settings from another modal", () => {
  beforeEach(() => store().setActiveModal(null));

  it("returns to that modal when the settings close", () => {
    store().setActiveModal(Modals.weather_forecast);
    store().openSettingsSection("weather");

    expect(store().activeModal).toBe(Modals.settings);

    store().closeModal();
    expect(store().activeModal).toBe(Modals.weather_forecast);
  });

  it("doesn't loop back through the settings it came from", () => {
    store().setActiveModal(Modals.settings);
    store().openModal(Modals.backgrounds);
    store().openSettingsSection("photos");
    store().closeModal();

    expect(store().activeModal).toBeNull();
  });
});
