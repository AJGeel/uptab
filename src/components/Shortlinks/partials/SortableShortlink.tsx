import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Shortlink as ShortlinkType } from "@/src/services/shortlinks/types";

import Shortlink from "./Shortlink";

interface SortableShortlinkProps {
  item: ShortlinkType;
  isDragging: boolean;
}

const SortableShortlink = ({ item, isDragging }: SortableShortlinkProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id,
    });

  return (
    <div
      ref={setNodeRef}
      className={"flex flex-col items-center active:z-10"}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
    >
      <Shortlink item={item} isDragging={isDragging} />
    </div>
  );
};

export default SortableShortlink;
