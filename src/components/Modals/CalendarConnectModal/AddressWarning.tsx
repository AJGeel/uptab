import { WarningIcon } from "@phosphor-icons/react";

import { CalendarProviderId } from "@/src/services/calendar/providers";

type Props = {
  /** Not a supported site at all, or a supported one but not a secret address. */
  kind: "unknown" | "shape";
  provider: CalendarProviderId;
  id: string;
};

const SHAPE_HELP: Record<CalendarProviderId, { title: string; body: string }> =
  {
    google: {
      title: "That isn't a Google Calendar secret address",
      body: "It should end in basic.ics. In your calendar's settings under Integrate calendar, copy the Secret address in iCal format, not the page's own address.",
    },
    outlook: {
      title: "That isn't an Outlook published link",
      body: "It should end in calendar.ics. In Outlook's settings under Shared calendars, publish your calendar and copy the ICS link, not the page's own address.",
    },
  };

/** A prominent notice for an address that isn't what's expected. */
const AddressWarning = ({ kind, provider, id }: Props) => {
  const { title, body } =
    kind === "unknown"
      ? {
          title: "That isn't a Google Calendar or Outlook address",
          body: "Only those two work for now. Copy the secret address from your calendar's settings, not the address of the page you're looking at.",
        }
      : SHAPE_HELP[provider];

  return (
    <div
      id={id}
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950"
    >
      <WarningIcon
        weight="fill"
        className="size-6 shrink-0 text-amber-500"
        aria-hidden
      />
      <div className="space-y-1 text-sm">
        <p className="text-base font-semibold">{title}</p>
        <p>
          {body}
          {kind === "shape" && " You can still connect if you're sure."}
        </p>
      </div>
    </div>
  );
};

export default AddressWarning;
