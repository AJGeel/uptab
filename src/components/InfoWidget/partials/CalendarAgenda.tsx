import {
  ArrowSquareOutIcon,
  CloudSlashIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import { format } from "date-fns";
import { useState } from "react";

import { MIN_RETRY_MS } from "@/src/hooks/queries/useLocationAndWeather";
import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import { useCalendarConnection } from "@/src/hooks/useCalendarConnection";
import type { CalendarStatus } from "@/src/services/calendar/calendarStatus";
import {
  EventLine,
  formatEventBadge,
  getTodaysEvents,
} from "@/src/services/calendar/eventLine";
import {
  formatUpdatedAgo,
  formatUpdatedAt,
} from "@/src/services/calendar/formatUpdated";
import type { CalendarEvent } from "@/src/services/calendar/types";
import { TimeFormat } from "@/src/services/settings/types";
import { delay } from "@/src/utils/delay";

import AgendaEventRow from "./AgendaEventRow";
import Button, { buttonVariants } from "../../ui/Button";
import Spinner from "../../ui/Spinner";

type Props = {
  status: CalendarStatus;
  events: CalendarEvent[];
  line: EventLine;
  now: number;
  timeFormat: TimeFormat;
  showJoin: boolean;
  /** When the events were fetched. */
  updatedAt: number;
  onRetry: () => Promise<unknown>;
  onClose: () => void;
};

const ReconnectPanel = ({ onClose }: Pick<Props, "onClose">) => {
  const openModal = useModalStore((state) => state.openModal);
  const { disconnect } = useCalendarConnection();

  return (
    <div className="space-y-4 px-2 py-3">
      <div className="flex items-start gap-2.5">
        <WarningIcon
          weight="fill"
          className="mt-0.5 size-5 shrink-0 text-amber-500"
          aria-hidden
        />
        <div className="space-y-1.5">
          <h3 className="font-semibold">Your calendar was disconnected</h3>
          <p className="text-sm text-gray-800">
            Google may have reset your secret address, or your browser took back
            UpTab&apos;s access to calendar.google.com. Paste your address again
            to reconnect, or disconnect to forget it.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          label="Disconnect"
          variant={buttonVariants.secondary}
          className="border whitespace-nowrap"
          onClick={() => {
            void disconnect();
            onClose();
          }}
        />
        <Button
          label="Reconnect"
          className="whitespace-nowrap"
          onClick={() => {
            onClose();
            openModal(Modals.calendarConnect);
          }}
        />
      </div>
    </div>
  );
};

const OfflineBanner = ({
  hasEvents,
  updatedAt,
  timeFormat,
  onRetry,
}: Pick<Props, "updatedAt" | "timeFormat" | "onRetry"> & {
  hasEvents: boolean;
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = async () => {
    setIsRetrying(true);
    // A retry can be over in a blink, so it shows as busy for long enough to notice.
    await Promise.all([onRetry(), delay(MIN_RETRY_MS)]);
    setIsRetrying(false);
  };

  return (
    <div
      role="status"
      className="mx-2 mb-2 flex items-start gap-2 rounded-xl bg-black/5 p-3 text-sm"
    >
      <CloudSlashIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p className="grow">
        Can&apos;t reach Google Calendar right now.
        {hasEvents &&
          ` These are your events from ${formatUpdatedAt(updatedAt, timeFormat)}.`}
      </p>
      <Button
        label={isRetrying ? "Trying…" : "Try again"}
        variant={buttonVariants.inline}
        className="shrink-0 self-center whitespace-nowrap"
        disabled={isRetrying}
        onClick={retry}
      />
    </div>
  );
};

/** Today's events, as a popover under the date. */
const CalendarAgenda = ({
  status,
  events,
  line,
  now,
  timeFormat,
  showJoin,
  updatedAt,
  onRetry,
  onClose,
}: Props) => {
  const openSettingsSection = useModalStore(
    (state) => state.openSettingsSection,
  );
  const { allDay, timed } = getTodaysEvents(events, now);
  const isOffline = status === "stale" || status === "unavailable";
  const isReconnect = status === "reconnect";

  const renderBody = () => {
    if (isReconnect) {
      return <ReconnectPanel onClose={onClose} />;
    }

    if (status === "loading") {
      return (
        <div className="flex justify-center py-8">
          <Spinner className="size-6" />
        </div>
      );
    }

    return (
      <>
        {isOffline && (
          <OfflineBanner
            hasEvents={status === "stale"}
            updatedAt={updatedAt}
            timeFormat={timeFormat}
            onRetry={onRetry}
          />
        )}

        {allDay.length > 0 && (
          <div className="flex items-start gap-3 p-2">
            <p className="w-14 shrink-0 pt-0.5 text-sm text-gray-600">
              All day
            </p>
            <ul className="flex min-w-0 flex-wrap gap-1.5">
              {allDay.map(({ id, title }) => (
                <li
                  key={id}
                  className="max-w-full truncate rounded-lg bg-sky-500/15 px-2 py-0.5 text-sm font-medium"
                >
                  {title}
                </li>
              ))}
            </ul>
          </div>
        )}

        {timed.length > 0 ? (
          <ul>
            {timed.map((event) => (
              <AgendaEventRow
                key={event.id}
                event={event}
                now={now}
                timeFormat={timeFormat}
                showJoin={showJoin}
                badge={
                  line.kind !== "none" &&
                  line.kind !== "allDay" &&
                  line.event.id === event.id
                    ? formatEventBadge(line, now)
                    : undefined
                }
              />
            ))}
          </ul>
        ) : (
          status !== "unavailable" &&
          allDay.length === 0 && (
            <p className="px-2 py-4 text-sm text-gray-700">
              Nothing on your calendar today.
            </p>
          )
        )}
      </>
    );
  };

  return (
    <div className="flex max-h-[min(32rem,calc(100dvh-8rem))] w-[min(29rem,calc(100vw-2rem))] flex-col">
      <header className="flex items-center justify-between gap-2 px-4 pt-3 pb-1">
        <h2 className="flex items-baseline gap-2.5 font-semibold">
          Today
          <span className="font-normal text-gray-600">
            {format(now, "EEE d MMM")}
          </span>
        </h2>

        <a
          href="https://calendar.google.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Open Google Calendar"
          className="rounded-lg p-1.5 text-gray-700 duration-150 hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-sky-500 active:scale-90"
        >
          <ArrowSquareOutIcon className="size-5" />
        </a>
      </header>

      <div className="min-h-0 grow overflow-y-auto px-2 pb-2">
        {renderBody()}
      </div>

      {!isReconnect && status !== "loading" && (
        <footer className="flex items-center justify-between gap-3 border-t border-black/10 px-4 py-2.5 text-xs text-gray-600">
          <p>
            {isOffline
              ? `Last updated ${formatUpdatedAt(updatedAt, timeFormat)}`
              : `Updated ${formatUpdatedAgo(updatedAt, now)}. New events can take a while to show up.`}
          </p>
          <Button
            label="Settings"
            variant={buttonVariants.inline}
            className="shrink-0 whitespace-nowrap"
            onClick={() => {
              onClose();
              openSettingsSection("calendar", "calendar");
            }}
          />
        </footer>
      )}
    </div>
  );
};

export default CalendarAgenda;
