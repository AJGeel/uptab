import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

import useLongHover from "@/src/hooks/useLongHover";
import { Shortlink as ShortlinkType } from "@/src/services/shortlinks/types";
import { cn } from "@/src/utils";

import Shortlink from "./Shortlink";

interface SortableShortlinkProps {
  item: ShortlinkType;
  isDragging: boolean;
}

const SortableShortlink = ({ item, isDragging }: SortableShortlinkProps) => {
  const { isLongHovering, hoverProps } = useLongHover();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id,
    });

  return (
    <div
      ref={setNodeRef}
      {...hoverProps}
      className={cn(
        "relative flex flex-col items-center active:z-10",
        isLongHovering && "cursor-help",
      )}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
    >
      <div
        className={cn(
          "pointer-events-none absolute -top-10 rounded border border-sky-900/10 bg-white px-2 py-1.5 shadow opacity-0 duration-200 flex items-center gap-0.5",
          isLongHovering && !isDragging && "opacity-100",
        )}
      >
        <InformationCircleIcon className="size-4 text-sky-500" />
        <p className="text-xs text-gray-900">
          Tip: try to drag/drop to reorder links
        </p>
      </div>
      <Shortlink item={item} isDragging={isDragging} />
    </div>
  );
};

export default SortableShortlink;
