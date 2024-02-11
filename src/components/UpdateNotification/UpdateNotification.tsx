import { SparklesIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useMemo } from "react";

import { useSettings } from "@/src/hooks/useSettings";

import { useUpdateNotification } from "../../hooks/useUpdateNotification";

const UpdateNotification = () => {
  const { data: settingsData } = useSettings();
  const { isVisible, onOpen, onHide } = useUpdateNotification();
  const RNG = useMemo(() => Math.random(), []);

  if (!settingsData?.sidebar.showUpdates || !isVisible) {
    return <></>;
  }

  return (
    <button
      className="mb-8 flex w-full items-center gap-2 rounded bg-sky-500/10 p-2 pl-4 duration-150 hover:bg-sky-500/20"
      onClick={(event) => {
        event.preventDefault();
        onOpen();
      }}
      rel="noreferrer noopener"
    >
      <SparklesIcon className="h-4 w-4 shrink-0 opacity-50" />
      <p className="grow text-left">
        UpTab has been updated! See what&apos;s new.
      </p>
      <button
        className="flex items-center gap-1 rounded-sm px-3 py-2 duration-150 hover:bg-sky-800/10 hover:text-sky-800"
        onClick={(event) => {
          event.stopPropagation();
          onHide();
        }}
      >
        {RNG >= 0.95 ? "Shut UpTab" : "Close"}
        <XMarkIcon className="h-4 w-4" />
      </button>
    </button>
  );
};

export default UpdateNotification;
