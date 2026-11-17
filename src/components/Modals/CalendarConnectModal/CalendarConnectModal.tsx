import { Collapsible } from "@base-ui/react/collapsible";
import {
  CaretDownIcon,
  CaretUpIcon,
  CircleNotchIcon,
  InfoIcon,
  LockIcon,
  ShieldCheckIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import { FormEvent, PropsWithChildren, useState } from "react";

import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import { useCalendarConnection } from "@/src/hooks/useCalendarConnection";
import { validateCalendarUrl } from "@/src/services/calendar/validateCalendarUrl";

import Button, { inlineLinkStyles } from "../../ui/Button";
import Modal from "../../ui/Modal";

type Status = "idle" | "waiting" | "declined";

const FORM_ID = "calendar-connect-form";
const INPUT_ID = "calendar-connect-url";
const SETTINGS_URL = "https://calendar.google.com/calendar/r/settings";

const Step = ({ number, children }: PropsWithChildren<{ number: number }>) => (
  <li className="flex items-start gap-2.5">
    <span
      aria-hidden
      className="flex size-5 shrink-0 items-center justify-center rounded-full bg-sky-500 text-xs font-semibold text-on-accent"
    >
      {number}
    </span>
    <span className="pt-px">{children}</span>
  </li>
);

const CalendarConnectModal = () => {
  const activeModal = useModalStore((state) => state.activeModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const { connect } = useCalendarConnection();

  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [isInvalid, setIsInvalid] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const isWaiting = status === "waiting";
  const isDeclined = status === "declined";

  const close = () => {
    setValue("");
    setStatus("idle");
    setIsInvalid(false);
    closeModal();
  };

  // Runs straight from the click or Enter: the browser only asks from one.
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const result = validateCalendarUrl(value);

    if (isWaiting) {
      return;
    }

    if (!result.ok) {
      setIsInvalid(true);

      return;
    }

    setStatus("waiting");
    connect(result.url).then(
      (isGranted) => (isGranted ? close() : setStatus("declined")),
      () => setStatus("declined"),
    );
  };

  return (
    <Modal
      isVisible={activeModal === Modals.calendarConnect}
      onClose={close}
      title="Show your events"
      className="max-w-xl"
      subtitle="See what's next on your Google Calendar, right under the date. UpTab only reads your events and never changes them."
    >
      <form
        id={FORM_ID}
        noValidate
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="space-y-3.5">
          <label htmlFor={INPUT_ID} className="block font-semibold">
            Secret address in iCal format
          </label>

          <div className="flex items-stretch gap-2">
            <div className="min-w-0 grow rounded-xl border bg-surface ring-sky-500 duration-150 focus-within:ring-2 focus-within:ring-offset-2">
              <input
                id={INPUT_ID}
                type="url"
                autoComplete="off"
                spellCheck={false}
                placeholder="https://calendar.google.com/calendar/ical/…/basic.ics"
                aria-invalid={isInvalid}
                aria-describedby={isInvalid ? `${INPUT_ID}-error` : undefined}
                className="w-full rounded-xl bg-surface px-3 py-2 font-sans focus-within:outline-hidden"
                value={value}
                onChange={(event) => {
                  setValue(event.target.value);
                  setIsInvalid(false);
                }}
              />
            </div>

            <Button
              type="submit"
              label={
                isWaiting ? "Waiting…" : isDeclined ? "Try again" : "Connect"
              }
              icon={
                isWaiting && (
                  <CircleNotchIcon
                    className="size-4 animate-spin"
                    aria-hidden
                  />
                )
              }
              className="shrink-0 whitespace-nowrap disabled:opacity-50"
              disabled={isWaiting || value.trim() === ""}
            />
          </div>

          {isInvalid && (
            <p
              id={`${INPUT_ID}-error`}
              role="alert"
              className="flex items-start gap-2 text-sm text-red-700"
            >
              <InfoIcon weight="fill" className="mt-0.5 size-4 shrink-0" />
              This isn&apos;t a Google Calendar address. Only Google Calendar
              works for now.
            </p>
          )}
        </div>

        {isDeclined && (
          <p
            role="status"
            className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-950"
          >
            <WarningIcon
              weight="fill"
              className="mt-0.5 size-4 shrink-0 text-amber-500"
            />
            <span>
              Your browser didn&apos;t allow access, so UpTab can&apos;t read
              your calendar yet. Press <strong>Try again</strong> and choose{" "}
              <strong>Allow</strong>.
            </span>
          </p>
        )}

        <Collapsible.Root open={isHelpOpen} onOpenChange={setIsHelpOpen}>
          <Collapsible.Trigger
            className={`${inlineLinkStyles} inline-flex items-center gap-1`}
          >
            Where do I find this?
            {isHelpOpen ? (
              <CaretUpIcon className="size-3.5" aria-hidden />
            ) : (
              <CaretDownIcon className="size-3.5" aria-hidden />
            )}
          </Collapsible.Trigger>

          <Collapsible.Panel className="-mx-2 h-(--collapsible-panel-height) overflow-hidden px-2 transition-[height] duration-300 ease-in-out data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none">
            <ol className="mt-3 space-y-2 text-sm">
              <Step number={1}>
                Open{" "}
                <a
                  href={SETTINGS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={inlineLinkStyles}
                >
                  Google Calendar settings
                </a>{" "}
                on a computer.
              </Step>
              <Step number={2}>
                Under <strong>Settings for my calendars</strong>, pick your
                calendar and choose <strong>Integrate calendar</strong>.
              </Step>
              <Step number={3}>
                Copy the <strong>Secret address in iCal format</strong> and
                paste it above.
              </Step>
            </ol>
          </Collapsible.Panel>
        </Collapsible.Root>

        <div className="space-y-2 rounded-xl bg-black/5 p-3 text-sm text-gray-800">
          <p className="flex items-start gap-2">
            <LockIcon weight="fill" className="mt-0.5 size-4 shrink-0" />
            <span>
              The address stays on this device and is only used to read your
              events. It&apos;s secret: anyone who has it can see your calendar,
              so don&apos;t share it.
            </span>
          </p>
          <p className="flex items-start gap-2">
            <ShieldCheckIcon weight="fill" className="mt-0.5 size-4 shrink-0" />
            <span>
              {isWaiting
                ? "Choose Allow in the browser's prompt to finish."
                : "Your browser will ask to let UpTab read calendar.google.com. That's the only site it gets."}
            </span>
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default CalendarConnectModal;
