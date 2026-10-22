import { SparklesIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";

import { useUpdateNotification } from "../../hooks/useUpdateNotification";

const UpdateNotification = () => {
  const { isVisible, onHide } = useUpdateNotification();
  const [RNG] = useState(() => Math.random());
  const setActiveModal = useModalStore((state) => state.setActiveModal);

  if (!isVisible) {
    return <></>;
  }

  return (
    <button
      className="mb-8 flex w-full items-center gap-2 rounded-2xl bg-sky-500/10 p-2 pl-4 duration-150 hover:bg-sky-500/20"
      onClick={(event) => {
        event.preventDefault();

        setActiveModal(Modals.whatsNew);
      }}
      rel="noreferrer noopener"
    >
      <SparklesIcon className="size-4 shrink-0 opacity-50" />
      <p className="grow text-left">
        UpTab has been updated! See what&apos;s new.
      </p>
      <button
        className="flex items-center gap-1 rounded-xl px-3 py-2 duration-150 hover:bg-sky-800/10 hover:text-sky-800"
        onClick={(event) => {
          event.stopPropagation();
          onHide();
        }}
      >
        {RNG >= 0.95 ? "Shut UpTab" : "Close"}
        <XMarkIcon className="size-4" />
      </button>
    </button>
  );
};

export default UpdateNotification;
