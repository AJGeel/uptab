import { ComponentProps, useEffect, useState } from "react";

import {
  getCachedFaviconIndex,
  setCachedFaviconIndex,
} from "@/src/services/faviconCache";
import { cn } from "@/src/utils";
import {
  FALLBACK_FAVICON,
  getFaviconSources,
  isChromeFavicon,
  isDuckDuckGoPlaceholder,
  isMissingFavicon,
} from "@/src/utils/getFavicon";
import { isEmoji } from "@/src/utils/icon";

interface FaviconProps extends Omit<ComponentProps<"img">, "src"> {
  /** A custom icon: an image URL or an emoji. It's used instead of looking for the page's own. */
  icon?: string;
  /** The page to find an icon for. */
  url?: string;
}

const Favicon = ({ icon, url = "", className, ...props }: FaviconProps) => {
  const sources = icon ? [icon] : getFaviconSources(url);
  const key = sources.join("\n");
  const cachedIndex = icon
    ? undefined
    : getCachedFaviconIndex(url, sources.length);

  // Which source is up, per list of sources, so a new page starts over.
  const [progress, setProgress] = useState({ key, index: cachedIndex ?? 0 });
  const index = progress.key === key ? progress.index : (cachedIndex ?? 0);
  const src = sources[index];

  // The source that's confirmed to be a real icon, and the one that showed.
  const [verifiedSrc, setVerifiedSrc] = useState<string>();
  const [loadedSrc, setLoadedSrc] = useState<string>();

  // What worked last time is trusted, so it shows without waiting for a check.
  const isRemembered = cachedIndex === index;
  const needsCheck = !!src && isChromeFavicon(src) && !isRemembered;
  const isVerified = !needsCheck || verifiedSrc === src;

  const advance = () => {
    setProgress({ key, index: index + 1 });

    if (!icon && index + 1 >= sources.length) {
      setCachedFaviconIndex(url, sources.length);
    }
  };

  useEffect(() => {
    if (!src || !needsCheck) {
      return;
    }

    let isStale = false;

    // Chrome answers an unknown page with a generic globe, which isn't wanted.
    isMissingFavicon(src).then((isMissing) => {
      if (isStale) {
        return;
      }

      if (isMissing) {
        advance();
      } else {
        setVerifiedSrc(src);
      }
    });

    return () => {
      isStale = true;
    };
    // `advance` only reads what the other dependencies already cover.
    // eslint-disable-next-line react-hooks/exhaustive-deps, @eslint-react/exhaustive-deps
  }, [src, needsCheck, key, index]);

  if (icon && isEmoji(icon)) {
    // Sized by the box it's in, so it matches the icons next to it.
    return (
      <span
        role="img"
        aria-label={icon}
        className={cn(
          "@container-size flex items-center justify-center leading-none",
          className,
        )}
      >
        <span aria-hidden="true" className="text-[100cqmin]">
          {icon}
        </span>
      </span>
    );
  }

  const shownSrc = src ?? FALLBACK_FAVICON;

  return (
    <img
      // Without a src it's an empty box of the same size, so nothing moves.
      src={isVerified ? shownSrc : undefined}
      onLoad={(event) => {
        if (src && isDuckDuckGoPlaceholder(src, event.currentTarget)) {
          advance();

          return;
        }

        setLoadedSrc(shownSrc);

        if (src && !icon) {
          setCachedFaviconIndex(url, index);
        }
      }}
      onError={advance}
      className={cn(
        "transition-opacity duration-150",
        // A remembered icon is in the browser's cache, so it shows straight away.
        !isRemembered && loadedSrc !== shownSrc && "opacity-0",
        className,
      )}
      {...props}
    />
  );
};

export default Favicon;
