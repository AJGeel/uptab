import useModalStore from "@src/hooks/useModalStore";

const EmptyState = () => {
  const setActiveModal = useModalStore((state) => state.setActiveModal);

  return (
    <p className="mt-2 text-sm text-black/70">
      No links found. Why don&apos;t you{" "}
      <span
        className="underline hover:no-underline hover:text-black cursor-pointer"
        onClick={() => setActiveModal("SHORTLINK")}
      >
        add one
      </span>
      ?
    </p>
  );
};

export default EmptyState;
