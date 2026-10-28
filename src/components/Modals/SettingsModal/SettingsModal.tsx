import { useRef, useState } from "react";

import {
  Modals,
  SettingsSection,
  useModalStore,
} from "@/src/hooks/stores/useModalStore";
import useKeyPress from "@/src/hooks/useKeyPress";
import { useSettings } from "@/src/hooks/useSettings";
import { hotkeys } from "@/src/services/hotkeys/hotkeys";

import SettingEntryRow from "./partials/SettingEntryRow";
import SettingsNav from "./partials/SettingsNav";
import { searchSettings } from "./searchSettings";
import {
  SettingEntry,
  Section,
  sections,
  settingEntries,
} from "./settingsRegistry";
import Button, { buttonVariants } from "../../ui/Button";
import Modal from "../../ui/Modal";

const SettingsModal = () => {
  const {
    data: settings,
    updateSettings,
    resetDefaultSettings,
    setSidebarOpen,
  } = useSettings();

  const activeModal = useModalStore((state) => state.activeModal);
  const setActiveModal = useModalStore((state) => state.setActiveModal);
  const requestedSection = useModalStore((state) => state.settingsSection);

  const [query, setQuery] = useState("");
  const [chosenSection, setChosenSection] = useState<SettingsSection>();
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const isSearching = query.trim() !== "";
  const matches = searchSettings(settingEntries, sections, query);
  const matchCounts = isSearching
    ? Object.fromEntries(
        sections.map(({ id }) => [
          id,
          matches.filter((entry) => entry.section === id).length,
        ]),
      )
    : undefined;

  const firstMatchingSection = sections.find(
    ({ id }) => (matchCounts?.[id] ?? 0) > 0,
  )?.id;
  const activeSection =
    chosenSection ?? requestedSection ?? firstMatchingSection ?? sections[0].id;

  const close = () => {
    setQuery("");
    setChosenSection(undefined);
    setActiveModal(null);
  };

  useKeyPress(hotkeys.slash, () => {
    if (activeModal === Modals.settings) {
      close();
    } else {
      setActiveModal(Modals.settings);
    }
  });

  const selectSection = (id: SettingsSection) => {
    setChosenSection(id);

    // The sidebar's settings are seen in the sidebar, the homescreen's without it.
    if (id === "sidebar") {
      setSidebarOpen(true);
    } else if (id === "homescreen") {
      setSidebarOpen(false);
    }

    // With a search, all the matches show: the section is somewhere in them.
    document
      .getElementById(`settings-section-${id}`)
      ?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  const renderSection = ({
    section,
    entries,
    canReset,
  }: {
    section: Section;
    entries: SettingEntry[];
    canReset: boolean;
  }) =>
    settings && (
      <section
        key={section.id}
        id={`settings-section-${section.id}`}
        aria-label={section.label}
        className="mb-6 scroll-mt-0 last:mb-0"
      >
        <div className="mb-1 flex items-center justify-between gap-2 px-3">
          <h2 className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
            {section.label}
          </h2>
          {canReset && section.reset && settings && (
            <Button
              label="Reset"
              variant={buttonVariants.inline}
              className="text-sm"
              onClick={() => updateSettings(section.reset!(settings))}
            />
          )}
        </div>
        {entries.map((entry) => (
          <SettingEntryRow
            key={entry.id}
            entry={entry}
            settings={settings}
            query={query}
            onChange={updateSettings}
          />
        ))}
      </section>
    );

  const visibleSections = isSearching
    ? sections.filter(({ id }) => (matchCounts?.[id] ?? 0) > 0)
    : sections.filter(({ id }) => id === activeSection);

  return (
    <Modal
      isVisible={activeModal === Modals.settings}
      onClose={close}
      onEscape={() => {
        if (!isSearching) {
          return false;
        }

        setQuery("");
        searchRef.current?.focus();

        return true;
      }}
      title="Edit Preferences"
      className="h-[min(39rem,calc(100dvh-2rem))] w-[calc(100vw-2rem)] max-w-208"
    >
      {!!settings && (
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:gap-6">
          <SettingsNav
            sections={sections}
            activeSection={activeSection}
            matchCounts={matchCounts}
            query={query}
            onQueryChange={setQuery}
            searchRef={searchRef}
            onSelect={selectSection}
            onResetEverything={() => setIsConfirmingReset(true)}
          />

          <div className="min-w-0 grow">
            {isSearching && matches.length === 0 && (
              <p className="px-3 py-1.5 text-gray-600">
                Nothing matches that. Try another word?
              </p>
            )}

            {visibleSections.map((section) =>
              renderSection({
                section,
                entries: (isSearching ? matches : settingEntries).filter(
                  (entry) => entry.section === section.id,
                ),
                canReset: !isSearching,
              }),
            )}

            <div className="mt-6 sm:hidden">
              <Button
                label="Reset everything"
                variant={buttonVariants.inline}
                className="text-sm"
                onClick={() => setIsConfirmingReset(true)}
              />
            </div>
          </div>
        </div>
      )}

      <Modal
        isVisible={isConfirmingReset}
        onClose={() => setIsConfirmingReset(false)}
        title="Reset everything?"
        subtitle="Every preference goes back to how UpTab came, including your saved locations and chosen themes. Your shortlinks and photos stay."
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              label="Never mind"
              variant={buttonVariants.secondary}
              onClick={() => setIsConfirmingReset(false)}
            />
            <Button
              label="Fresh start!"
              className="bg-red-500 ring-red-500"
              onClick={() => {
                resetDefaultSettings();
                setIsConfirmingReset(false);
              }}
            />
          </div>
        }
      />
    </Modal>
  );
};

export default SettingsModal;
