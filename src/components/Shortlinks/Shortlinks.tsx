import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";

import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import { useShortlinkStore } from "@/src/hooks/stores/useShortlinkStore";
import { getShortlinks } from "@/src/services/shortlinks";
import { reorderShortlinks } from "@/src/services/shortlinks/reorderShortlinks";
import { Shortlink as ShortlinkType } from "@/src/services/shortlinks/types";
import { cn } from "@/src/utils";

import EmptyState from "./partials/EmptyState";
import SortableShortlink from "./partials/SortableShortlink";

const Shortlinks = () => {
  const queryClient = useQueryClient();

  const [isDragging, setIsDragging] = useState(false);
  const wasDragging = useRef(false);

  const setActiveModal = useModalStore((state) => state.setActiveModal);
  const setSelectedShortlink = useShortlinkStore((state) => state.setSelected);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const { isPending, isError, data } = useQuery({
    queryFn: getShortlinks,
    queryKey: ["shortlinks"],
  });

  const reorderMutation = useMutation({ mutationFn: reorderShortlinks });

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    setIsDragging(false)

    requestAnimationFrame(() => {
      wasDragging.current = false
    })

    if (!data) {
      return
    }

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = data.findIndex((item) => item.id === active.id);
    const newIndex = data.findIndex((item) => item.id === over.id);

    const updatedItems = arrayMove(data, oldIndex, newIndex);

    queryClient.setQueryData<ShortlinkType[]>(
      ["shortlinks"],
      updatedItems
    );

    await reorderMutation.mutateAsync(updatedItems);
  };

  if (isPending) {
    return <p className="mt-10">Loading...</p>;
  }

  if (isError) {
    return <p>Unable to display your shortlinks.</p>;
  }

  return (
    <div className="mt-10 first:mt-0">
      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={() => {
            setIsDragging(true)
            wasDragging.current = true;
          }}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={data.map((item) => item.id)}
            strategy={rectSortingStrategy}
          >
            <div className={cn("grid grid-cols-2 gap-2 p-2 -m-2 rounded duration-250 border border-dashed border-transparent transition-colors", isDragging && "bg-gray-100 border-gray-200")}>
              {data.map((item) => (
                <SortableShortlink key={item.id} item={item} isDragging={wasDragging.current} />
              ))}

            </div>
              <div className="col-span-2 mt-4">
                <button
                  className="inline cursor-pointer underline hover:text-black hover:no-underline"
                  onClick={() => {
                    setSelectedShortlink(null);
                    setActiveModal(Modals.shortlink);
                  }}
                >
                  Add a link
                </button>
              </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default Shortlinks;