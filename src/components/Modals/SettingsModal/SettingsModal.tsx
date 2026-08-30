import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import useKeyPress from "@/src/hooks/useKeyPress";
import { useSettings } from "@/src/hooks/useSettings";
import { hotkeys } from "@/src/services/hotkeys/hotkeys";

import SettingsRow from "./partials/SettingsRow";
import Button, { buttonVariants } from "../../ui/Button";
import Modal from "../../ui/Modal";
import Tabs from "../../ui/Tabs/Tabs";
import { settingsRows } from "@/src/services/settings/settingsRows";

const SettingsModal = () => {
  const {
    data: settings,
    toggleSidebarSetting,
    toggleHomescreenSetting,
    resetDefaultSettings,
    setSidebarOpen,
  } = useSettings();

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
              ]}
              onTabChange={(id) => {
                if (id === "Sidebar") {
                  setSidebarOpen(true);
                  return;
                }

                if (id === "Homescreen") {
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
