import { PlusIcon } from "@heroicons/react/24/outline";

import { useBackgroundCatalogue } from "@/src/hooks/queries/useBackgroundCatalogue";
import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import useKeyPress from "@/src/hooks/useKeyPress";
import { useSettings } from "@/src/hooks/useSettings";
import { LOCAL_THEME } from "@/src/services/backgrounds/localPhotos";
import { getEnabledThemes } from "@/src/services/backgrounds/pickDailyImage";
import { BackgroundImage } from "@/src/services/backgrounds/types";
import { hotkeys } from "@/src/services/hotkeys/hotkeys";

import ThemeCard, { Cover } from "./partials/ThemeCard";
import Button, { buttonVariants } from "../../ui/Button";
import Modal from "../../ui/Modal";

const COVER_COUNT = 4;

/** The theme's cover photos, topped up with its other photos if there are fewer. */
const getCovers = (
  coverImageIds: string[],
  images: BackgroundImage[],
): Cover[] => {
  const covers = coverImageIds
    .map((id) => images.find((image) => image.id === id))
    .filter((image) => image !== undefined);
  const others = images.filter((image) => !covers.includes(image));

  return [...covers, ...others].slice(0, COVER_COUNT).map((image) => ({
    id: image.id,
    color: image.color,
    thumbnailUrl: image.thumbnail?.url ?? null,
  }));
};

const BackgroundsModal = () => {
  const { data: settings, setBackgroundThemes } = useSettings();
  const { catalogue, remoteCatalogue } = useBackgroundCatalogue();
  const activeModal = useModalStore((state) => state.activeModal);
  const setActiveModal = useModalStore((state) => state.setActiveModal);

  useKeyPress(hotkeys.b, () => {
    setActiveModal(
      activeModal === Modals.backgrounds ? null : Modals.backgrounds,
    );
  });

  const themes =
    catalogue?.themes
      .map((theme) => {
        const images = catalogue.images.filter(
          (image) => image.theme === theme.id,
        );

        return {
          ...theme,
          count: images.length,
          covers: getCovers(theme.coverImageIds, images),
        };
      })
      .filter((theme) => theme.count > 0) ?? [];

  // What's actually shown, including the fallback when nothing valid is saved.
  const selected =
    catalogue && settings
      ? getEnabledThemes(catalogue, settings.backgrounds.themes)
      : [];
  const photoCount = themes
    .filter((theme) => selected.includes(theme.id))
    .reduce((sum, theme) => sum + theme.count, 0);

  const toggle = (id: string) =>
    setBackgroundThemes(
      selected.includes(id)
        ? selected.filter((themeId) => themeId !== id)
        : [...selected, id],
    );

  return (
    <Modal
      isVisible={activeModal === Modals.backgrounds}
      onClose={() => setActiveModal(null)}
      title="Backgrounds"
      subtitle={
        <>
          Pick the themes you&apos;d like to see. You get a different photo
          every day, or browse them with the ← and → arrow keys.{" "}
          <a
            href="https://uptab.vercel.app/backgrounds"
            className="underline duration-150 hover:text-sky-800 hover:no-underline"
          >
            See all photos
          </a>
        </>
      }
      className="max-w-2xl"
      footer={
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-gray-700">
            {catalogue && `Showing ${photoCount} photos`}
          </p>
          <div className="flex items-center gap-2">
            {catalogue && selected.length < themes.length && (
              <Button
                label="All themes"
                variant={buttonVariants.secondary}
                onClick={() => setBackgroundThemes([])}
              />
            )}
            <Button label="Done" onClick={() => setActiveModal(null)} />
          </div>
        </div>
      }
    >
      {!remoteCatalogue && (
        <p className="mb-4 text-sm text-gray-700">
          Backgrounds couldn&apos;t be loaded. Check your connection and try
          again.
        </p>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {!themes.some((theme) => theme.id === LOCAL_THEME) && (
          <button
            type="button"
            onClick={() => setActiveModal(Modals.localPhotos)}
            className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-black/20 p-3 text-center text-sm text-gray-700 ring-sky-500 duration-150 hover:border-sky-500 hover:bg-sky-50 hover:text-sky-700 focus-visible:ring-2 focus-visible:outline-hidden"
          >
            <PlusIcon className="size-6" />
            Add your own photos
          </button>
        )}
        {themes.map((theme) => (
          <ThemeCard
            key={theme.id}
            name={theme.name}
            count={theme.count}
            covers={theme.covers}
            isSelected={selected.includes(theme.id)}
            isLocked={selected.length === 1 && selected[0] === theme.id}
            onClick={() => toggle(theme.id)}
            onManage={
              theme.id === LOCAL_THEME
                ? () => setActiveModal(Modals.localPhotos)
                : undefined
            }
          />
        ))}
      </div>
    </Modal>
  );
};

export default BackgroundsModal;
