import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import useKeyPress, { hotkeys } from "@/src/hooks/useKeyPress";

import Hotkey from "./partials/Hotkey";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";

export type HotkeyType = {
  k: string | string[];
  description: string;
};

const items: HotkeyType[] = [
  {
    description: "Toggle sidebar visibility",
    k: hotkeys.backslash,
  },
  {
    description: "Toggle the menu you're currently looking at",
    k: hotkeys.questionMark,
  },
  {
    description: "Toggle the settings menu",
    k: hotkeys.slash,
  },
];

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
        {items.map((item) => (
          <Hotkey
            key={String(item.k)}
            k={item.k}
            description={item.description}
          />
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
