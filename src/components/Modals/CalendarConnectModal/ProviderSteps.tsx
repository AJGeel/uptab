import { PropsWithChildren } from "react";

import { CalendarProviderId } from "@/src/services/calendar/providers";

import { inlineLinkStyles } from "../../ui/Button";

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

const Link = ({ href, children }: PropsWithChildren<{ href: string }>) => (
  <a href={href} target="_blank" rel="noreferrer" className={inlineLinkStyles}>
    {children}
  </a>
);

/** Where to find the secret address, for each calendar. */
const ProviderSteps = ({ provider }: { provider: CalendarProviderId }) =>
  provider === "outlook" ? (
    <ol className="mt-3 space-y-2 text-sm">
      <Step number={1}>
        Open <Link href="https://outlook.live.com/calendar/">Outlook</Link> on
        the web, then go to <strong>Settings</strong>, <strong>Calendar</strong>{" "}
        and <strong>Shared calendars</strong>.
      </Step>
      <Step number={2}>
        Under <strong>Publish a calendar</strong>, pick your calendar, choose{" "}
        <strong>Can view all details</strong> and press <strong>Publish</strong>
        .
      </Step>
      <Step number={3}>
        Copy the <strong>ICS</strong> link and paste it above. Work and school
        accounts can&apos;t always publish: ask your IT team if the option is
        missing.
      </Step>
    </ol>
  ) : (
    <ol className="mt-3 space-y-2 text-sm">
      <Step number={1}>
        Open{" "}
        <Link href="https://calendar.google.com/calendar/r/settings">
          Google Calendar settings
        </Link>{" "}
        on a computer.
      </Step>
      <Step number={2}>
        Under <strong>Settings for my calendars</strong>, pick your calendar and
        choose <strong>Integrate calendar</strong>.
      </Step>
      <Step number={3}>
        Copy the <strong>Secret address in iCal format</strong> and paste it
        above.
      </Step>
    </ol>
  );

export default ProviderSteps;
