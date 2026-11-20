import { EnvelopeSimpleIcon } from "@phosphor-icons/react";

import { CALENDAR_PROVIDER_ICONS } from "@/src/services/calendar/providerIcons";
import { CalendarProviderId } from "@/src/services/calendar/providers";
import { cn } from "@/src/utils";

type Props = {
  provider: CalendarProviderId;
  className?: string;
};

/** The calendar's logo in its colour, or a mail icon for one without a logo. */
const CalendarProviderIcon = ({ provider, className }: Props) => {
  const { path, color } = CALENDAR_PROVIDER_ICONS[provider];

  if (!path) {
    return (
      <EnvelopeSimpleIcon
        aria-hidden
        weight="fill"
        color={color}
        className={cn("size-4 shrink-0", className)}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      fill={color}
      className={cn("size-4 shrink-0", className)}
    >
      <path d={path} />
    </svg>
  );
};

export default CalendarProviderIcon;
