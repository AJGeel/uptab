import Modal from "../ui/Modal";
import useKeyPress from "@src/hooks/useKeyPress";
import useModalStore from "@src/hooks/useModalStore";
import Hotkey from "./Hotkey";

export type HotkeyType = {
  k: string | string[];
  description: string;
};

const hotkeys: HotkeyType[] = [
  {
    k: "\\",
    description: "Toggle sidebar visibility",
  },
  {
    k: "?",
    description: "Toggle the menu you're currently looking at",
  },
];

const HotkeysModal = () => {
  const activeModal = useModalStore((state) => state.activeModal);
  const setActiveModal = useModalStore((state) => state.setActiveModal);

  useKeyPress("?", () => {
    console.log(activeModal);
    setActiveModal("HOTKEY");
  });

  return (
    <Modal
      isVisible={activeModal === "HOTKEY"}
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
          <button
            className="bg-sky-500 text-white hover:brightness-110 duration-150 ring-offset-2 active:ring-2 ring-sky-500 inline-flex items-center justify-center rounded px-4 py-3 font-medium leading-none focus:outline-none focus:ring-2 active:brightness-100"
            onClick={() => setActiveModal(null)}
          >
            Got it, thanks.
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default HotkeysModal;
