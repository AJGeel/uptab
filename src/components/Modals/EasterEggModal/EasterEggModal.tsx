import { useEggStore } from "@/src/hooks/stores/useEggStore";
import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import { eggs } from "@/src/services/easterEggs/eggs";

import EggAchievement from "./EggAchievement";
import Button, { buttonVariants } from "../../ui/Button";
import Modal from "../../ui/Modal";

/** Shown instead of the photo controls, while an easter egg has taken over the photo. */
const EasterEggModal = () => {
  const activeModal = useModalStore((state) => state.activeModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const openSettingsSection = useModalStore(
    (state) => state.openSettingsSection,
  );
  const activeEgg = useEggStore((state) => state.activeEgg);
  const achievement = activeEgg ? eggs[activeEgg].achievement : undefined;

  return (
    <Modal
      isVisible={activeModal === Modals.easterEgg && !!activeEgg}
      onClose={closeModal}
      title="You found an easter egg"
      subtitle={
        achievement && `${achievement.name}. ${achievement.explanation}`
      }
      banner={activeEgg && <EggAchievement egg={activeEgg} />}
      footer={
        <div className="flex justify-end">
          <Button label="Noice!" onClick={closeModal} />
        </div>
      }
    >
      {achievement && (
        <div className="flex flex-col gap-3 text-gray-900">
          <p>{achievement.explanation}</p>
          <p className="text-sm text-gray-600">
            It's gone with your next tab. Not your thing?{" "}
            <Button
              label="Turn easter eggs off"
              variant={buttonVariants.inline}
              className="text-sm"
              onClick={() => openSettingsSection("appearance", "disableFun")}
            />
            .
          </p>
        </div>
      )}
    </Modal>
  );
};

export default EasterEggModal;
