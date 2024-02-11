import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";

const EmptyState = () => {
  const setActiveModal = useModalStore((state) => state.setActiveModal);

  return (
    <p className="mt-2 text-sm text-black/70">
      No links found. Why don&apos;t you{" "}
      <span
        className="cursor-pointer underline hover:text-black hover:no-underline"
        onClick={() => setActiveModal(Modals.shortlink)}
      >
        add one
      </span>
      ?
    </p>
  );
};

export default EmptyState;
