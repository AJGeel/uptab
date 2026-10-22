import { format, isValid, parseISO } from "date-fns";
import { lazy, Suspense } from "react";
import { runtime } from "webextension-polyfill";

import { useReleaseNotes } from "@/src/hooks/queries/useReleaseNotes";
import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import { useRandomBackground } from "@/src/hooks/useRandomBackground/useRandomBackground";

import AnimatedHeight from "../../ui/AnimatedHeight";
import Banner from "../../ui/Banner";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import Spinner from "../../ui/Spinner";

const ChangelogMarkdown = lazy(() => import("../../ui/ChangelogMarkdown"));

const CHANGELOG_URL = "/src/pages/changelog/index.html";

const WhatsNewModal = () => {
  const activeModal = useModalStore((state) => state.activeModal);
  const setActiveModal = useModalStore((state) => state.setActiveModal);
  const isVisible = activeModal === Modals.whatsNew;
  const { data: notes, isError, isPending } = useReleaseNotes(isVisible);
  const { activeBg } = useRandomBackground();
  const { version } = runtime.getManifest();
  const close = () => setActiveModal(null);
  const releaseDate = notes?.date ? parseISO(notes.date) : null;
  const title = `What's new in UpTab ${version}`;
  const released =
    releaseDate && isValid(releaseDate)
      ? `Released ${format(releaseDate, "d MMMM yyyy")}`
      : undefined;

  return (
    <Modal
      isVisible={isVisible}
      onClose={close}
      title={title}
      subtitle={released}
      banner={
        <Banner photoSrc={activeBg?.src} title={title} subtitle={released} />
      }
      className="max-w-xl"
      footer={
        <div className="flex items-center justify-between gap-2">
          <a
            href={CHANGELOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-700 underline duration-150 hover:no-underline"
          >
            View full changelog
          </a>
          <Button label="Okie dokie!" onClick={close} />
        </div>
      }
    >
      <AnimatedHeight>
        {isPending && <Spinner className="mx-auto my-8 size-8" />}

        {(isError || notes === null) && (
          <p className="text-sm text-gray-700">
            The notes for this version aren&apos;t available here. The full
            changelog has them.
          </p>
        )}

        {notes && (
          <Suspense fallback={<Spinner className="mx-auto my-8 size-8" />}>
            <ChangelogMarkdown markdown={notes.body} />
          </Suspense>
        )}
      </AnimatedHeight>
    </Modal>
  );
};

export default WhatsNewModal;
