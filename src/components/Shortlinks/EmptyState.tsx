import useModalStore from "@src/hooks/useModalStore";

const EmptyState = () => {
  const setIsModalVisible = useModalStore((state) => state.setIsVisible);

  return (
    <>
      <p className="text-sm text-black/70">*Crickets*</p>
      <p className="mt-2 text-sm text-black/70">
        No links found. Why don&apos;t you{" "}
        <span
          className="underline hover:no-underline hover:text-black cursor-pointer"
          onClick={() => setIsModalVisible(true)}
        >
          add one
        </span>
        ?
      </p>
    </>
  );
};

export default EmptyState;
