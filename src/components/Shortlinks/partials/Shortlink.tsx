import { InformationCircleIcon, PencilIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import { useShortlinkStore } from "@/src/hooks/stores/useShortlinkStore";
import useLongHover from "@/src/hooks/useLongHover";
import { Shortlink } from "@/src/services/shortlinks";
import { cn } from "@/src/utils";
import { getFavicon } from "@/src/utils/getFavicon";

import IconButton from "../../ui/IconButton";
import ImageWithFallback from "../../ui/ImageWithFallback";

type Props = {
  item: Shortlink;
  isDragging: boolean;
};

const Shortlink = ({ item, isDragging }: Props) => {
  const { isLongHovering, hoverProps } = useLongHover();
  const [isHoveringSecondary, setIsHoveringSecondary] = useState(false);

  const setActiveModal = useModalStore((state) => state.setActiveModal);
  const setSelectedShortlink = useShortlinkStore((state) => state.setSelected);

  return (
    <a
      {...hoverProps}
      href={isDragging ? undefined : item.url}
      className={cn(
        "w-full flex cursor-pointer items-center gap-3 rounded-xl border bg-white px-3 py-2.5 shadow-sm ring-sky-500 duration-150 hover:ring focus:outline-none focus:ring group relative",
        isDragging && "cursor-grabbing",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -top-10 rounded border border-sky-900/10 bg-white px-2 py-1.5 shadow opacity-0 duration-200 flex items-center gap-0.5",
          isLongHovering &&
            !isDragging &&
            !isHoveringSecondary &&
            "opacity-100",
        )}
      >
        <InformationCircleIcon className="size-4 text-sky-500" />
        <p className="text-xs text-gray-900">
          Tip: drag &apos;n drop to reorder links
        </p>
      </div>
      <ImageWithFallback
        src={item.icon ?? getFavicon(item.url)}
        fallbackSrc="/icon-34.png"
        className="size-6 shrink-0 rounded"
      />
      <div className="flex grow flex-col truncate">
        <h2 className="truncate text-sm font-semibold">{item.title}</h2>
        <p className="truncate text-sm text-gray-600">{item.subtitle}</p>
      </div>
      <IconButton
        onMouseEnter={() => setIsHoveringSecondary(true)}
        onMouseLeave={() => setIsHoveringSecondary(false)}
        className="rounded-lg border-none opacity-0 scale-90 group-hover:scale-100 shadow-none group-hover:opacity-100"
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
  );
};

export default Shortlink;
