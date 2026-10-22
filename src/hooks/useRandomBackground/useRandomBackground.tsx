import { format } from "date-fns";
import { useState } from "react";

import { getCatalogue } from "@/src/services/backgrounds/getCatalogue";
import { getImageSrc } from "@/src/services/backgrounds/getImageSrc";
import {
  getEnabledImages,
  pickDailyImage,
} from "@/src/services/backgrounds/pickDailyImage";
import { BackgroundImage, Catalogue } from "@/src/services/backgrounds/types";
import { withLocalPhotos } from "@/src/services/backgrounds/withLocalPhotos";

import { useBackgroundCatalogue } from "../queries/useBackgroundCatalogue";
import { useDailyPick } from "../queries/useDailyPick";
import { useSettings } from "../useSettings";

/** Built in, for the first run offline or when the site is unreachable. */
const FALLBACK_IMAGE: BackgroundImage = {
  id: "fallback",
  theme: "holland",
  author: "Vishwas Katti",
  link: "https://unsplash.com/photos/body-of-water-beside-green-trees-and-wind-mills-x2XDMf-rirc",
  color: "#d8e8f8",
  sources: [{ width: 1920, url: "/images/fallback-background.webp" }],
  thumbnail: null,
};

/**
 * Today's photo, and a way to browse from it. Safe to call from several
 * components: they share the pick, and keys are handled by the caller.
 */
export const useRandomBackground = () => {
  const { data: settings } = useSettings();
  const { catalogue, localPhotos, isPending } = useBackgroundCatalogue();
  const { pick: stored, isHydrated, setPick } = useDailyPick();
  // Fixed per tab, so the photo doesn't change at midnight.
  const [date] = useState(() => format(new Date(), "yyyy-MM-dd"));
  // A catalogue fetched again after an image failed to load.
  const [reloaded, setReloaded] = useState<Catalogue | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  const activeCatalogue = reloaded
    ? withLocalPhotos(reloaded, localPhotos)
    : catalogue;
  const images =
    activeCatalogue && settings
      ? getEnabledImages(activeCatalogue, settings.backgrounds.themes)
      : [];
  const isReady = !isPending && isHydrated && !!settings;
  const picked = isReady ? pickDailyImage(images, date, stored) : undefined;
  const activeBg =
    useFallback || (isReady && !picked) ? FALLBACK_IMAGE : picked;

  const browse = (step: number) => {
    if (!picked) {
      return;
    }

    const index = images.indexOf(picked);
    const next = images[(index + step + images.length) % images.length];

    setUseFallback(false);
    setPick({ date, imageId: next.id });
  };

  /** First failure: refetch the catalogue, skipping the HTTP cache. Then: fallback. */
  const onError = async () => {
    if (!picked || reloaded || activeBg === FALLBACK_IMAGE) {
      setUseFallback(true);
      return;
    }

    const fresh = await getCatalogue({ reload: true });
    const freshImage = fresh?.images.find((image) => image.id === picked.id);

    if (
      fresh &&
      freshImage &&
      getImageSrc(freshImage) !== getImageSrc(picked)
    ) {
      setReloaded(fresh);
    } else {
      setUseFallback(true);
    }
  };

  return {
    activeBg: activeBg && {
      src: getImageSrc(activeBg),
      author: activeBg.author,
      link: activeBg.link,
    },
    onError,
    browse,
  };
};
