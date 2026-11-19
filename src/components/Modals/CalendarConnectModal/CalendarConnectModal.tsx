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
import { FormEvent, useState } from "react";
import { runtime, tabs } from "webextension-polyfill";

import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import { useCalendarConnection } from "@/src/hooks/useCalendarConnection";
import {
  CALENDAR_PROVIDERS,
  CalendarProviderId,
  getProvider,
} from "@/src/services/calendar/providers";
import { validateCalendarUrl } from "@/src/services/calendar/validateCalendarUrl";
import { buildFeedbackUrl } from "@/src/services/feedback/feedbackUrl";

import ProviderSteps from "./ProviderSteps";
import Button, { inlineLinkStyles } from "../../ui/Button";
import CalendarProviderIcon from "../../ui/CalendarProviderIcon";
import Modal from "../../ui/Modal";
import Select from "../../ui/Select";

type Status = "idle" | "waiting" | "declined";

const FORM_ID = "calendar-connect-form";
const INPUT_ID = "calendar-connect-url";

const PLACEHOLDERS: Record<CalendarProviderId, string> = {
  google: "https://calendar.google.com/calendar/ical/…/basic.ics",
  outlook: "https://outlook.live.com/owa/calendar/…/calendar.ics",
};

const ADDRESS_LABELS: Record<CalendarProviderId, string> = {
  google: "Secret address in iCal format",
  outlook: "Published ICS link",
};

const CalendarConnectModal = () => {
  const activeModal = useModalStore((state) => state.activeModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const { connect } = useCalendarConnection();

  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [isInvalid, setIsInvalid] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [providerId, setProviderId] = useState<CalendarProviderId>("google");
  const provider = getProvider(providerId);
  const sites = provider.hosts.map(({ host }) => host).join(" or ");
  // Some calendars live on more than one site, and only the address's is asked for.
  const accessNote =
    provider.hosts.length > 1
      ? `Your browser will ask to let UpTab read only the site your link is on: ${sites}.`
      : `Your browser will ask to let UpTab read ${sites}. That's the only site it gets.`;

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
      subtitle={
        <span className="flex flex-wrap items-center gap-y-1">
          See what&apos;s next on your
          <Select
            ariaLabel="Calendar"
            value={providerId}
            isIconFirst
            options={CALENDAR_PROVIDERS.map(({ id, label }) => ({
              value: id,
              label,
              icon: <CalendarProviderIcon provider={id} />,
            }))}
            triggerLabel={
              <span className="flex items-center gap-2 whitespace-nowrap">
                <CalendarProviderIcon provider={providerId} />
                {provider.label}
              </span>
            }
            // Only these work for now: this is how people ask for the rest.
            action={{
              label: "Missing yours? Let me know",
              onClick: () =>
                void tabs.create({
                  url: buildFeedbackUrl(
                    runtime.getManifest().version,
                    navigator.userAgent,
                  ),
                }),
            }}
            onValueChange={(next) => setProviderId(next as CalendarProviderId)}
            className="-mr-1.5 ml-1"
          />
          , right under the date.
        </span>
      }
    >
      <form
        id={FORM_ID}
        noValidate
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="space-y-3.5">
          <label htmlFor={INPUT_ID} className="block font-semibold">
            {ADDRESS_LABELS[providerId]}
          </label>

          <div className="flex items-stretch gap-2">
            <div className="min-w-0 grow rounded-xl border bg-surface ring-sky-500 duration-150 focus-within:ring-2 focus-within:ring-offset-2">
              <input
                id={INPUT_ID}
                type="url"
                autoComplete="off"
                spellCheck={false}
                placeholder={PLACEHOLDERS[providerId]}
                aria-invalid={isInvalid}
                aria-describedby={isInvalid ? `${INPUT_ID}-error` : undefined}
                className="w-full rounded-xl bg-surface px-3 py-2 font-sans focus-within:outline-hidden"
                value={value}
                onChange={(event) => {
                  const result = validateCalendarUrl(event.target.value);

                  // A pasted address says which calendar it is.
                  if (result.ok) {
                    setProviderId(result.connection.provider);
                  }

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
              This isn&apos;t a Google Calendar or Outlook address. Only those
              two work for now.
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
            <ProviderSteps provider={providerId} />
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
                : accessNote}
            </span>
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default CalendarConnectModal;
