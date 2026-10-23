import { XMarkIcon } from "@heroicons/react/24/solid";
import { motion } from "motion/react";
import { useState } from "react";

import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import { cn } from "@/src/utils";

import { useUpdateNotification } from "../../hooks/useUpdateNotification";

type Props = {
  /** Over the homescreen's photo, instead of in the sidebar. */
  variant?: "sidebar" | "floating";
};

type SparkleProps = {
  d: string;
  delay: number;
};

const Sparkle = ({ d, delay }: SparkleProps) => (
  <motion.path
    d={d}
    style={{ transformBox: "fill-box", transformOrigin: "center" }}
    animate={{
      scale: [1, 0.8, 1],
      opacity: [0.5, 0.3, 0.5],
    }}
    transition={{
      duration: 1.6,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const Sparkles = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    className="size-5 shrink-0"
  >
    <Sparkle
      d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5Z"
      delay={0}
    />
    <Sparkle
      d="M18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5Z"
      delay={0.2}
    />
    <Sparkle
      d="M16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
      delay={0.4}
    />
  </svg>
);

const UpdateNotification = ({ variant = "sidebar" }: Props) => {
  const { isVisible, onHide } = useUpdateNotification();
  const [RNG] = useState(() => Math.random());
  const setActiveModal = useModalStore((state) => state.setActiveModal);

  if (!isVisible) {
    return <></>;
  }

  return (
    <button
      className={cn(
        "flex w-full items-center gap-2 rounded-2xl p-2 pl-4 duration-150",
        variant === "sidebar"
          ? "mb-8 bg-sky-500/10 hover:bg-sky-500/20"
          : "bg-white/80 text-black shadow-lg backdrop-blur-sm hover:bg-white/90",
      )}
      onClick={(event) => {
        event.preventDefault();

        setActiveModal(Modals.whatsNew);
      }}
      rel="noreferrer noopener"
    >
      <Sparkles />
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
