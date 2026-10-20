import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

import { useBackgroundCatalogue } from "@/src/hooks/queries/useBackgroundCatalogue";
import { useLocalPhotos } from "@/src/hooks/queries/useLocalPhotos";
import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import { useSettings } from "@/src/hooks/useSettings";
import { AddResult, LOCAL_THEME } from "@/src/services/backgrounds/localPhotos";
import { getEnabledThemes } from "@/src/services/backgrounds/pickDailyImage";
import { cn } from "@/src/utils";

import DropZone from "./partials/DropZone";
import Button, { buttonVariants } from "../../ui/Button";
import Modal from "../../ui/Modal";

const photos = (count: number) =>
  `${count} ${count === 1 ? "photo" : "photos"}`;

const describeResult = ({ added, duplicates, failed }: AddResult) =>
  [
    added > 0 ? `Added ${photos(added)}.` : "No new photos.",
    duplicates > 0 && `${photos(duplicates)} already added.`,
    failed > 0 && `${photos(failed)} couldn't be read.`,
  ]
    .filter(Boolean)
    .join(" ");

const LocalPhotosModal = () => {
  const {
    photos: localPhotos,
    addPhotos,
    isAdding,
    removePhotos,
    clearPhotos,
  } = useLocalPhotos();
  const { catalogue } = useBackgroundCatalogue();
  const { data: settings, setBackgroundThemes } = useSettings();
  const activeModal = useModalStore((state) => state.activeModal);
  const setActiveModal = useModalStore((state) => state.setActiveModal);
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  // Share of the files done while adding, from 0 to 1.
  const [progress, setProgress] = useState<number | null>(null);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  const reset = () => {
    setSelected([]);
    setStatus(null);
    setIsConfirmingClear(false);
  };

  const back = () => {
    reset();
    setActiveModal(Modals.backgrounds);
  };

  const add = async (files: File[]) => {
    const images = files.filter((file) => file.type.startsWith("image/"));

    reset();

    if (images.length === 0) {
      setStatus("No photos found.");
      return;
    }

    // What's shown now, so turning on local photos doesn't drop the fallback.
    const themes =
      catalogue && settings
        ? getEnabledThemes(catalogue, settings.backgrounds.themes)
        : (settings?.backgrounds.themes ?? []);

    try {
      const onProgress = (done: number) => {
        setStatus(
          `Adding ${Math.min(done + 1, images.length)} of ${images.length}…`,
        );
        setProgress(done / images.length);
      };

      onProgress(0);
      const result = await addPhotos({ files: images, onProgress });

      setStatus(describeResult(result));

      if (result.added > 0 && !themes.includes(LOCAL_THEME)) {
        await setBackgroundThemes([...themes, LOCAL_THEME]);
      }
    } catch {
      setStatus("There's no room for more photos. Remove some and try again.");
    } finally {
      setProgress(null);
    }
  };

  const toggle = (id: string) => {
    setIsConfirmingClear(false);
    setSelected((ids) =>
      ids.includes(id) ? ids.filter((other) => other !== id) : [...ids, id],
    );
  };

  const removeSelected = async () => {
    await removePhotos(selected);
    setStatus(`Removed ${photos(selected.length)}.`);
    setSelected([]);
  };

  const clear = async () => {
    if (!isConfirmingClear) {
      setIsConfirmingClear(true);
      return;
    }

    await clearPhotos();
    reset();
  };

  return (
    <Modal
      isVisible={activeModal === Modals.localPhotos}
      onClose={back}
      title="My photos"
      subtitle="Add photos from your computer to show them alongside the themes. They're kept in this browser only."
      className="max-w-2xl"
      footer={
        <div className="flex items-center justify-between gap-2">
          {selected.length > 0 ? (
            <>
              <p className="text-sm text-gray-700">
                {selected.length} selected
                {selected.length < localPhotos.length && (
                  <>
                    {" · "}
                    <Button
                      label="Select all"
                      variant={buttonVariants.inline}
                      onClick={() =>
                        setSelected(localPhotos.map((photo) => photo.id))
                      }
                    />
                  </>
                )}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  label="Cancel"
                  variant={buttonVariants.secondary}
                  onClick={() => setSelected([])}
                />
                <Button
                  label={`Remove ${photos(selected.length)}`}
                  className="bg-red-500 ring-red-500"
                  onClick={removeSelected}
                />
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-700">
                {localPhotos.length > 0
                  ? `${photos(localPhotos.length)} · Click photos to select them`
                  : "Photos you add show up here"}
              </p>
              <div className="flex items-center gap-2">
                {localPhotos.length > 0 && (
                  <Button
                    label={isConfirmingClear ? "Remove all?" : "Remove all"}
                    variant={buttonVariants.secondary}
                    className={cn(isConfirmingClear && "text-red-600")}
                    onClick={clear}
                  />
                )}
                <Button label="Done" onClick={back} />
              </div>
            </>
          )}
        </div>
      }
    >
      <DropZone
        status={status}
        progress={progress}
        isBusy={isAdding}
        isEmpty={localPhotos.length === 0}
        onFiles={add}
      />

      {localPhotos.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {localPhotos.map((photo) => {
            const isSelected = selected.includes(photo.id);

            return (
              <button
                key={photo.id}
                type="button"
                aria-label="Photo"
                aria-pressed={isSelected}
                onClick={() => toggle(photo.id)}
                className={cn(
                  "relative aspect-square rounded-lg bg-cover bg-center ring-sky-500 ring-offset-2 duration-150 focus-visible:ring-2 focus-visible:outline-hidden",
                  isSelected ? "ring-2" : "hover:brightness-90",
                )}
                style={{
                  backgroundColor: photo.color,
                  backgroundImage: photo.thumbnail
                    ? `url("${photo.thumbnail.url}")`
                    : undefined,
                }}
              >
                {isSelected && (
                  <CheckCircleIcon className="absolute top-1.5 right-1.5 size-6 rounded-full bg-white text-sky-500 shadow-sm" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </Modal>
  );
};

export default LocalPhotosModal;
