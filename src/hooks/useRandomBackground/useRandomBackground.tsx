import { format } from "date-fns";
import { useState } from "react";

import { getCatalogue } from "@/src/services/backgrounds/getCatalogue";
import {
  DailyPick,
  getEnabledImages,
  pickDailyImage,
} from "@/src/services/backgrounds/pickDailyImage";
import { pickRendition } from "@/src/services/backgrounds/pickRendition";
import { BackgroundImage, Catalogue } from "@/src/services/backgrounds/types";

import { useCatalogue } from "../queries/useCatalogue";
import useKeyPress from "../useKeyPress";
import { usePersistedState } from "../usePersistedState";
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

const getSrc = (image: BackgroundImage) =>
  pickRendition(
    image.sources,
    Math.round(window.screen.width * window.devicePixelRatio),
  )?.url;

export const useRandomBackground = () => {
  const { data: settings } = useSettings();
  const { catalogue, isPending } = useCatalogue();
  const [stored, setStored, isHydrated] = usePersistedState<DailyPick | null>(
    "dailyBackground",
    null,
  );
  // Fixed per tab, so the photo doesn't change at midnight.
  const [date] = useState(() => format(new Date(), "yyyy-MM-dd"));
  // A catalogue fetched again after an image failed to load.
  const [reloaded, setReloaded] = useState<Catalogue | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  const activeCatalogue = reloaded ?? catalogue;
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
    setStored({ date, imageId: next.id });
  };

  useKeyPress("ArrowRight", () => browse(1));
  useKeyPress("ArrowLeft", () => browse(-1));

  /** First failure: refetch the catalogue, skipping the HTTP cache. Then: fallback. */
  const onError = async () => {
    if (!picked || reloaded || activeBg === FALLBACK_IMAGE) {
      setUseFallback(true);
      return;
    }

    const fresh = await getCatalogue({ reload: true });
    const freshImage = fresh?.images.find((image) => image.id === picked.id);

    if (fresh && freshImage && getSrc(freshImage) !== getSrc(picked)) {
      setReloaded(fresh);
    } else {
      setUseFallback(true);
    }
  };

  return {
    activeBg: activeBg && {
      src: getSrc(activeBg),
      author: activeBg.author,
      link: activeBg.link,
    },
    onError,
    browse,
  };
};
