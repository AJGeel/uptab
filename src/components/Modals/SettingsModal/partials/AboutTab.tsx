import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import { format, isValid, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { runtime } from "webextension-polyfill";

import { useReleaseNotes } from "@/src/hooks/queries/useReleaseNotes";
import { buildFeedbackUrl } from "@/src/services/feedback/feedbackUrl";
import {
  canCheckForUpdate,
  checkForUpdate,
  UpdateCheck,
} from "@/src/services/updateCheck/updateCheck";
import { delay } from "@/src/utils/delay";

import Button, { buttonVariants, inlineLinkStyles } from "../../../ui/Button";

const CHANGELOG_URL = "https://uptab.vercel.app/changelog";
const AUTHOR_URL = "https://arthur-geel.vercel.app";
/** A check can be over in a blink, so it shows as busy for long enough to notice. */
const MIN_CHECK_MS = 800;

const messages = {
  latest: "You're on the latest version.",
  throttled: "Checked a moment ago. Try again in a few minutes.",
  error: "Couldn't check for updates. Are you online?",
} as const;

const AboutTab = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<UpdateCheck>();
  const [isReady, setIsReady] = useState(false);
  const [spins, setSpins] = useState(0);
  const { data: notes } = useReleaseNotes(true);
  const releaseDate = notes?.date ? parseISO(notes.date) : null;

  // The browser downloads the update first: restarting any sooner installs nothing.
  useEffect(() => {
    const onReady = () => setIsReady(true);

    runtime.onUpdateAvailable?.addListener(onReady);

    return () => runtime.onUpdateAvailable?.removeListener(onReady);
  }, []);

  const check = async () => {
    setIsChecking(true);

    const [outcome] = await Promise.all([
      checkForUpdate(),
      delay(MIN_CHECK_MS),
    ]);

    setResult(outcome);
    setIsChecking(false);
  };

  const isUpdating = result?.status === "available";
  const version = isUpdating && result.version ? ` ${result.version}` : "";
  const message = isUpdating
    ? isReady
      ? `Version${version} is ready to install.`
      : `Found version${version}, downloading...`
    : result && result.status in messages
      ? messages[result.status as keyof typeof messages]
      : undefined;

  return (
    <div
      data-setting="general.about"
      className="flex flex-col gap-4 rounded-xl p-3"
    >
      <div className="relative flex items-center overflow-hidden rounded-2xl bg-slate-900 text-white">
        <img
          src="/images/fallback-background.webp"
          alt=""
          className="absolute inset-0 size-full scale-110 object-cover object-[30%_60%] opacity-30 blur-[2px]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-black/10" />

        <div className="relative flex items-center gap-4 p-5">
          <div>
            <h3 className="text-xl font-bold">UpTab</h3>
            <p className="mt-1 text-white/90">
              The new tab I've always wanted: quick access to bookmarks, links,
              weather info and beautiful photos to brighten my day.
            </p>
            <p className="mt-2 text-sm text-white/80">
              <a
                className="-mx-2 -my-1 inline-block rounded-xl px-2 py-1 duration-150 hover:bg-white/15 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden active:scale-95 active:bg-white/25"
                href={AUTHOR_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Built by <span className="underline">Arthur Geel</span>
              </a>{" "}
              · 2023–now
            </p>
          </div>
          <img
            src="/icon-128.png"
            alt=""
            className="size-16 shrink-0 cursor-pointer rounded-2xl shadow-lg duration-700 ease-out select-none active:scale-90 motion-reduce:transition-none"
            style={{ rotate: `${spins * 360}deg` }}
            onClick={() => setSpins((count) => count + 1)}
          />
        </div>
      </div>

      <a
        className="flex flex-wrap items-center gap-3 rounded-2xl bg-sky-500/10 px-5 py-4 ring-sky-500 duration-150 hover:bg-sky-500/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden active:scale-98"
        href={buildFeedbackUrl(
          runtime.getManifest().version,
          navigator.userAgent,
        )}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="min-w-48 flex-1">
          <span className="block font-semibold">Tell me what you think</span>
          <span className="block text-sm text-gray-700">
            A bug, an idea or just a hello: I read every message, and it shapes
            what UpTab becomes.
          </span>
        </span>
        <span className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-sky-500 px-4 py-3 leading-none font-medium text-white">
          Send feedback
          <ArrowSquareOutIcon className="size-4" />
        </span>
      </a>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <p className="font-semibold">
              Version {runtime.getManifest().version}
            </p>
            <a
              className={`${inlineLinkStyles} inline-flex items-center gap-1 text-sm`}
              href={`${CHANGELOG_URL}#v${runtime.getManifest().version}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              See what&apos;s new
              <ArrowSquareOutIcon className="size-3.5" />
            </a>
          </div>
          {releaseDate && isValid(releaseDate) && (
            <p className="mt-0.5 text-xs text-gray-600">
              Released {format(releaseDate, "d MMMM yyyy")}
            </p>
          )}
        </div>

        {isUpdating && isReady ? (
          <Button
            label="Restart to update"
            className="shrink-0"
            onClick={() => runtime.reload()}
          />
        ) : canCheckForUpdate() ? (
          <Button
            label={isChecking ? "Checking..." : "Check for updates"}
            variant={buttonVariants.secondary}
            className="shrink-0 border bg-white"
            disabled={isChecking}
            onClick={check}
          />
        ) : (
          <p className="text-sm text-gray-600">
            Firefox updates UpTab by itself.
          </p>
        )}
      </div>

      {message && (
        <p role="status" className="text-sm text-gray-600">
          {message}
        </p>
      )}
    </div>
  );
};

export default AboutTab;
