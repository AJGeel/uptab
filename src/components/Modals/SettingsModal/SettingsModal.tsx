import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import useKeyPress, { hotkeys } from "@/src/hooks/useKeyPress";
import { useSettings } from "@/src/hooks/useSettings";
import { bgThemes } from "@/src/services/background/types";

import { rows } from "./partials/rows";
import SettingsRow from "./partials/SettingsRow";
import Button, { buttonVariants } from "../../ui/Button";
import Modal from "../../ui/Modal";
import Tabs from "../../ui/Tabs/Tabs";

const SettingsModal = () => {
  const {
    data: settings,
    toggleSidebarSetting,
    toggleHomescreenSetting,
    resetDefaultSettings,
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
      <div className="mt-4 flex max-h-screen min-h-[420px] flex-col">
        {!!settings && (
          <div className="flex grow flex-col">
            <Tabs
              tabs={[
                {
                  label: "Background",
                  content: (
                    <>
                      <SettingsRow
                        title={rows.background[0].title}
                        description={rows.background[0].description}
                        type="Dropdown"
                        options={Object.values(bgThemes)}
                        selected={settings.background.theme}
                        onClick={() => {}}
                      />
                    </>
                  ),
                },
                {
                  label: "Sidebar",
                  content: (
                    <>
                      {rows.sidebar.map((row) => (
                        <SettingsRow
                          key={"sidebar" + row.title}
                          title={row.title}
                          description={row.description}
                          type="Switch"
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
                      {rows.homescreen.map((row) => (
                        <SettingsRow
                          key={"description" + row.title}
                          title={row.title}
                          type="Switch"
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
            />
          </div>
        )}
        <div className="mt-auto flex items-center justify-end gap-2 pt-4">
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
