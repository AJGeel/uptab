import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import useKeyPress from "@/src/hooks/useKeyPress";
import { hotkeyDescriptions, hotkeys } from "@/src/services/hotkeys/hotkeys";

import { Hotkey } from "./partials/HotkeyDescription";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";

const HotkeysModal = () => {
  const activeModal = useModalStore((state) => state.activeModal);
  const setActiveModal = useModalStore((state) => state.setActiveModal);

  useKeyPress(hotkeys.questionMark, () => {
    setActiveModal(activeModal === Modals.hotkey ? null : Modals.hotkey);
  });

  return (
    <Modal
      isVisible={activeModal === Modals.hotkey}
      onClose={() => setActiveModal(null)}
      title="Keyboard Shortcuts"
      subtitle="Speed up your UpTab game with shortcuts. So much time for activities."
    >
      <div className="flex flex-col">
        {Object.entries(hotkeyDescriptions).map(([key, item]) => (
          <div
            key={key}
            className="mt-2 flex items-center justify-between border-t pt-2 first:mt-0 first:border-t-0"
          >
            <p className="text-gray-900">{item.description}</p>
            <Hotkey label={item.keyDisplay} size="sm" />
          </div>
        ))}
        <div className="mt-8 flex justify-end gap-2">
          <Button
            label="Got it, thanks."
            onClick={() => setActiveModal(null)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default HotkeysModal;
