import useKeyPress from "@/src/hooks/useKeyPress";
import { Modals, useModalStore } from "@/src/hooks/useModalStore";

import Hotkey from "./partials/Hotkey";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";

export type HotkeyType = {
  k: string | string[];
  description: string;
};

const hotkeys: HotkeyType[] = [
  {
    description: "Toggle sidebar visibility",
    k: "\\",
  },
  {
    description: "Toggle the menu you're currently looking at",
    k: "?",
  },
];

const HotkeysModal = () => {
  const activeModal = useModalStore((state) => state.activeModal);
  const setActiveModal = useModalStore((state) => state.setActiveModal);

  useKeyPress("?", () => {
    setActiveModal(Modals.hotkey);
  });

  return (
    <Modal
      isVisible={activeModal === Modals.hotkey}
      onClose={() => setActiveModal(null)}
      title="Keyboard Shortcuts"
      subtitle="Speed up your UpTab game with shortcuts. So much time for activities."
    >
      <div className="flex flex-col">
        {hotkeys.map((item) => (
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
