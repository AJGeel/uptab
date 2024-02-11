import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import useKeyPress from "@/src/hooks/useKeyPress";
import { useSettings } from "@/src/hooks/useSettings";
import { defaultSettings } from "@/src/services/settings/defaultSettings";
import { Settings } from "@/src/services/settings/types";

import SettingsRow from "./partials/SettingsRow";
import Button, { buttonVariants } from "../../ui/Button";
import Modal from "../../ui/Modal";

const SettingsModal = () => {
  // const { isPending, isError} = useSettings();
  const { data, editMutation } = useSettings();

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
              title="Shortlinks in Sidebar"
              description="Enables quick access to configurable links."
              isActive={data.sidebar.showShortlinks}
              onClick={async () => {
                const newState: Settings = {
                  ...data,
                  sidebar: {
                    showBookmarks: data.sidebar.showBookmarks,
                    showUpdates: data.sidebar.showUpdates,
                    showShortlinks: !data.sidebar.showShortlinks,
                  },
                };

                await editMutation.mutateAsync(newState);
              }}
            />
            <SettingsRow
              title="Bookmarks in Sidebar"
              description="Access your browser bookmarks in the sidebar."
              isActive={data.sidebar.showBookmarks}
              onClick={async () => {
                const newState: Settings = {
                  ...data,
                  sidebar: {
                    showBookmarks: !data.sidebar.showBookmarks,
                    showUpdates: data.sidebar.showUpdates,
                    showShortlinks: data.sidebar.showShortlinks,
                  },
                };

                await editMutation.mutateAsync(newState);
              }}
            />
            <SettingsRow
              title="Updates in Sidebar"
              description="Shows an inline notification when UpTab is updated."
              isActive={data.sidebar.showUpdates}
              onClick={async () => {
                const newState: Settings = {
                  ...data,
                  sidebar: {
                    showBookmarks: data.sidebar.showBookmarks,
                    showUpdates: !data.sidebar.showUpdates,
                    showShortlinks: data.sidebar.showShortlinks,
                  },
                };

                await editMutation.mutateAsync(newState);
              }}
            />
          </div>
        )}
        <div className="flex items-center justify-end gap-2">
          <Button
            label="Reset defaults"
            variant={buttonVariants.secondary}
            onClick={async () => {
              await editMutation.mutateAsync(defaultSettings);
            }}
          />
          <Button label="Close" onClick={() => setActiveModal(null)} />
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
