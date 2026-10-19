import { SparklesIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { runtime } from "webextension-polyfill";

import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import { useSettings } from "@/src/hooks/useSettings";

import { useUpdateNotification } from "../../hooks/useUpdateNotification";

// 2.0 introduces the backgrounds picker, so the notice points there instead.
const isBackgroundsRelease = runtime.getManifest().version.startsWith("2.0.");

const UpdateNotification = () => {
  const { isVisible, onOpen, onHide } = useUpdateNotification();
  const [RNG] = useState(() => Math.random());
  const setActiveModal = useModalStore((state) => state.setActiveModal);
  const { setSidebarOpen } = useSettings();

  if (!isVisible) {
    return <></>;
  }

  return (
    <button
      className="mb-8 flex w-full items-center gap-2 rounded-2xl bg-sky-500/10 p-2 pl-4 duration-150 hover:bg-sky-500/20"
      onClick={(event) => {
        event.preventDefault();

        if (isBackgroundsRelease) {
          onHide();
          setSidebarOpen(false);
          setActiveModal(Modals.backgrounds);
        } else {
          onOpen();
        }
      }}
      rel="noreferrer noopener"
    >
      <SparklesIcon className="size-4 shrink-0 opacity-50" />
      <p className="grow text-left">
        {isBackgroundsRelease
          ? "New: choose your own backgrounds!"
          : "UpTab has been updated! See what's new."}
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
