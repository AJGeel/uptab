import { PencilIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import { useShortlinkStore } from "@/src/hooks/stores/useShortlinkStore";
import { Shortlink } from "@/src/services/shortlinks";
import { cn } from "@/src/utils";
import { getFavicon } from "@/src/utils/getFavicon";

import IconButton from "../../ui/IconButton";
import ImageWithFallback from "../../ui/ImageWithFallback";
import Tooltip from "../../ui/Tooltip";

type Props = {
  item: Shortlink;
  isDragging: boolean;
};

const Shortlink = ({ item, isDragging }: Props) => {
  const [isHoveringSecondary, setIsHoveringSecondary] = useState(false);

  const setActiveModal = useModalStore((state) => state.setActiveModal);
  const setSelectedShortlink = useShortlinkStore((state) => state.setSelected);

  return (
    <Tooltip
      label="Tip: drag 'n drop to reorder links"
      disabled={isDragging || isHoveringSecondary}
    >
      <a
        href={isDragging ? undefined : item.url}
        className={cn(
          "group relative flex w-full cursor-pointer items-center gap-3 rounded-xl border bg-white px-3 py-2.5 shadow-xs ring-sky-500 duration-150 hover:ring-3 focus:ring-3 focus:outline-hidden",
          isDragging && "cursor-grabbing",
        )}
      >
        <ImageWithFallback
          src={item.icon ?? getFavicon(item.url)}
          fallbackSrc="/icon-34.png"
          className="size-6 shrink-0 rounded-sm"
        />
        <div className="flex grow flex-col truncate">
          <h2 className="truncate text-sm font-semibold">{item.title}</h2>
          <p className="truncate text-sm text-gray-600">{item.subtitle}</p>
        </div>
        <IconButton
          onMouseEnter={() => setIsHoveringSecondary(true)}
          onMouseLeave={() => setIsHoveringSecondary(false)}
          className="scale-90 rounded-lg border-none opacity-0 shadow-none group-hover:scale-100 group-hover:opacity-100"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();

            if (isDragging) {
              return;
            }

            setSelectedShortlink(item);
            setActiveModal(Modals.shortlink);
          }}
        >
          <PencilIcon className="size-4 text-gray-600" />
        </IconButton>
      </a>
    </Tooltip>
  );
};

export default Shortlink;
