import { useCatalogue } from "@/src/hooks/queries/useCatalogue";
import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import useKeyPress from "@/src/hooks/useKeyPress";
import { useSettings } from "@/src/hooks/useSettings";
import { hotkeys } from "@/src/services/hotkeys/hotkeys";
import { settingsRows } from "@/src/services/settings/settingsRows";

import SettingsRow from "./partials/SettingsRow";
import Button, { buttonVariants } from "../../ui/Button";
import Modal from "../../ui/Modal";
import Tabs from "../../ui/Tabs/Tabs";

const SettingsModal = () => {
  const {
    data: settings,
    toggleSidebarSetting,
    toggleHomescreenSetting,
    toggleBackgroundTheme,
    resetDefaultSettings,
    setSidebarOpen,
  } = useSettings();
  const { catalogue } = useCatalogue();

  const activeModal = useModalStore((state) => state.activeModal);
  const setActiveModal = useModalStore((state) => state.setActiveModal);

  useKeyPress(hotkeys.slash, () => {
    setActiveModal(activeModal === Modals.settings ? null : Modals.settings);
  });

  return (
    <Modal
      isVisible={activeModal === Modals.settings}
      onClose={() => setActiveModal(null)}
      title="Edit Preferences"
      className="max-w-xl"
    >
      <div className="mt-4 space-y-4">
        {!!settings && (
          <div className="flex flex-col">
            <Tabs
              tabs={[
                {
                  label: "Sidebar",
                  content: (
                    <>
                      {Object.values(settingsRows.sidebar).map((row) => (
                        <SettingsRow
                          key={row.setting}
                          title={row.title}
                          description={row.description}
                          isActive={settings.sidebar[row.setting]}
                          onClick={() => {
                            toggleSidebarSetting(row.setting);
                          }}
                        />
                      ))}
                    </>
                  ),
                },
                {
                  label: "Homescreen",
                  content: (
                    <>
                      {Object.values(settingsRows.homescreen).map((row) => (
                        <SettingsRow
                          key={row.setting}
                          title={row.title}
                          description={row.description}
                          isActive={settings.homescreen[row.setting]}
                          onClick={() => {
                            toggleHomescreenSetting(row.setting);
                          }}
                        />
                      ))}
                    </>
                  ),
                },
                {
                  label: "Backgrounds",
                  content: (
                    <>
                      {catalogue?.themes.map((theme) => {
                        const count = catalogue.images.filter(
                          (image) => image.theme === theme.id,
                        ).length;

                        return (
                          <SettingsRow
                            key={theme.id}
                            title={theme.name}
                            description={`${count} ${count === 1 ? "photo" : "photos"}`}
                            isActive={settings.backgrounds.themes.includes(
                              theme.id,
                            )}
                            onClick={() => {
                              toggleBackgroundTheme(theme.id);
                            }}
                          />
                        );
                      })}
                      {!catalogue && (
                        <p className="py-3 text-sm text-gray-700">
                          Backgrounds couldn&apos;t be loaded. Check your
                          connection and try again.
                        </p>
                      )}
                    </>
                  ),
                },
              ]}
              onTabChange={(id) => {
                if (id === "Sidebar") {
                  setSidebarOpen(true);
                  return;
                }

                if (id === "Homescreen" || id === "Backgrounds") {
                  setSidebarOpen(false);
                  return;
                }
              }}
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <Button
            label="Reset defaults"
            variant={buttonVariants.secondary}
            onClick={resetDefaultSettings}
          />
          <Button label="Close" onClick={() => setActiveModal(null)} />
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
