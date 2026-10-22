import { useQuery } from "@tanstack/react-query";
import { format, isValid, parseISO } from "date-fns";
import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { Components } from "react-markdown";

import { Background } from "@/src/components/ui/Background";
import Banner from "@/src/components/ui/Banner";
import ChangelogMarkdown from "@/src/components/ui/ChangelogMarkdown";
import { useCatalogue } from "@/src/hooks/queries/useCatalogue";
import { getImageSrc } from "@/src/services/backgrounds/getImageSrc";
import { hash } from "@/src/services/backgrounds/pickDailyImage";
import { pickRendition } from "@/src/services/backgrounds/pickRendition";
import { BackgroundImage } from "@/src/services/backgrounds/types";
import {
  parseChangelog,
  Release,
} from "@/src/services/changelog/parseChangelog";

/** The cards are narrower than the screen, so they don't need its full size. */
const CARD_WIDTH = 768;

/** The intro sits on the dark photo, not on a card. */
const introComponents: Components = {
  p: ({ children }) => <p className="text-white/85">{children}</p>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-white underline duration-150 hover:no-underline"
    >
      {children}
    </a>
  ),
};

/** The catalogue's photos in an order that's random for each visit, but stable during it. */
const useShuffledPhotos = () => {
  const { catalogue } = useCatalogue();
  const [seed] = useState(() => Math.random());

  return [...(catalogue?.images ?? [])].sort(
    (a, b) => hash(`${seed}:${a.id}`) - hash(`${seed}:${b.id}`),
  );
};

const ReleaseCard = ({
  release,
  photo,
}: {
  release: Release;
  photo?: BackgroundImage;
}) => {
  const ref = useRef<HTMLElement>(null);
  // Photos only load for cards that are near the screen.
  const isNear = useInView(ref, { once: true, margin: "400px 0px" });
  const date = release.date ? parseISO(release.date) : null;

  return (
    <article
      ref={ref}
      className="overflow-hidden rounded-2xl bg-white/95 text-base text-gray-800 shadow-lg backdrop-blur-lg backdrop-brightness-190 backdrop-saturate-150"
    >
      <Banner
        photoSrc={
          isNear && photo
            ? pickRendition(
                photo.sources,
                Math.round(CARD_WIDTH * window.devicePixelRatio),
              )?.url
            : undefined
        }
        title={`UpTab ${release.version}`}
        subtitle={
          date && isValid(date)
            ? `Released ${format(date, "d MMMM yyyy")}`
            : undefined
        }
        className="h-36"
      />

      <div className="p-8 md:px-10">
        <ChangelogMarkdown markdown={release.body} />
      </div>
    </article>
  );
};

const Changelog = () => {
  const photos = useShuffledPhotos();
  const { data, isError, isPending } = useQuery({
    queryFn: async () => {
      const response = await fetch("/CHANGELOG.md");

      if (!response.ok) {
        throw new Error("Couldn't read the changelog");
      }

      return response.text();
    },
    queryKey: ["changelog"],
    // A file inside the extension, so don't pause while the browser is offline.
    networkMode: "always",
  });
  const changelog = data ? parseChangelog(data) : null;

  return (
    <div className="min-h-screen px-4 py-12">
      <Background
        src={photos[0] && getImageSrc(photos[0])}
        alt=""
        className="fixed inset-0 bg-linear-to-b from-sky-500 to-sky-800"
      />
      <div className="fixed inset-0 bg-black/50" />

      <div className="relative mx-auto max-w-3xl">
        <header className="mb-8 text-base text-white text-shadow-black/30 text-shadow-md">
          <h1 className="text-3xl font-bold">UpTab Changelog</h1>

          <div className="mt-2">
            {isPending && <p>Loading...</p>}
            {isError && <p>Something has gone wrong.</p>}
            {changelog && (
              <ChangelogMarkdown
                markdown={changelog.intro}
                components={introComponents}
              />
            )}
          </div>
        </header>

        <div className="space-y-8">
          {changelog?.releases.map((release, index) => (
            <ReleaseCard
              key={release.version}
              release={release}
              // The first photo is behind the page.
              photo={photos[index + 1]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Changelog;
