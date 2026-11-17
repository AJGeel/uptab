import { VideoCameraIcon } from "@phosphor-icons/react";

import { cn } from "@/src/utils";

type Props = {
  href: string;
  /** Filled while the event is on, otherwise a quiet pill. */
  isPrimary: boolean;
  /** The widget's small line, which stays colourless over any photo, or the agenda's rows. */
  placement?: "widget" | "agenda";
};

/** Opens a meeting link in a new tab. */
const JoinPill = ({ href, isPrimary, placement = "widget" }: Props) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    data-setting="calendar.showJoinButton"
    className={cn(
      // The pseudo-element makes the small pill comfortable to hit.
      "pointer-events-auto relative z-10 inline-flex shrink-0 items-center gap-1 rounded-full leading-none font-medium whitespace-nowrap duration-150 before:absolute before:-inset-x-1 before:-inset-y-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500",
      placement === "widget"
        ? // Follows the text colour, so it reads on a photo and in either theme.
          cn(
            "h-4 px-1.5 text-[11px]",
            isPrimary
              ? "bg-current/20 font-semibold hover:bg-current/30"
              : "bg-current/10 hover:bg-current/20",
          )
        : cn(
            "h-6 px-2.5 text-xs",
            isPrimary
              ? "bg-sky-500 text-on-accent hover:brightness-110"
              : "bg-black/5 hover:bg-black/10",
          ),
    )}
  >
    <VideoCameraIcon
      weight="fill"
      className={placement === "widget" ? "size-3" : "size-3.5"}
      aria-hidden
    />
    Join
  </a>
);

export default JoinPill;
