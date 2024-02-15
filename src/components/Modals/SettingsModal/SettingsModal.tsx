import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import useKeyPress from "@/src/hooks/useKeyPress";
import { useSettings } from "@/src/hooks/useSettings";

import SettingsRow from "./partials/SettingsRow";
import Button, { buttonVariants } from "../../ui/Button";
import Modal from "../../ui/Modal";

const SettingsModal = () => {
  // const { isPending, isError} = useSettings();
  const { data, toggleSidebarSetting, resetDefaultSettings } = useSettings();

  const activeModal = useModalStore((state) => state.activeModal);
  const setActiveModal = useModalStore((state) => state.setActiveModal);

  useKeyPress("∆", () => {
    setActiveModal(activeModal === Modals.settings ? null : Modals.settings);
  });

  return (
    <Modal
      isVisible={activeModal === Modals.settings}
      onClose={() => setActiveModal(null)}
      title="Edit Settings"
    >
      <div className="mt-4 space-y-4">
        {!!data && (
          <div className="flex flex-col divide-y divide-gray-200">
            <SettingsRow
              title="Info Widget in Sidebar"
              description="Shows weather forecasts and date."
              isActive={data.sidebar.showInfoWidget}
              onClick={() => {
                toggleSidebarSetting("showInfoWidget");
              }}
            />
            <SettingsRow
              title="Shortlinks in Sidebar"
              description="Enables quick access to configurable links."
              isActive={data.sidebar.showShortlinks}
              onClick={() => {
                toggleSidebarSetting("showShortlinks");
              }}
            />
            <SettingsRow
              title="Bookmarks in Sidebar"
              description="Access your browser bookmarks in the sidebar."
              isActive={data.sidebar.showBookmarks}
              onClick={() => {
                toggleSidebarSetting("showBookmarks");
              }}
            />
            <SettingsRow
              title="Updates in Sidebar"
              description="Shows an inline notification when UpTab is updated."
              isActive={data.sidebar.showUpdates}
              onClick={() => {
                toggleSidebarSetting("showUpdates");
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
