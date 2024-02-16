import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";

import Button, { buttonVariants } from "../../ui/Button";

const EmptyState = () => {
  const setActiveModal = useModalStore((state) => state.setActiveModal);

  return (
    <div className="mt-2 text-black/70 first:mt-0">
      <p>
        No links found. Why don&apos;t you{" "}
        <Button
          variant={buttonVariants.inline}
          label="add one"
          onClick={() => setActiveModal(Modals.shortlink)}
        />
        ?
      </p>
    </div>
  );
};

export default EmptyState;
