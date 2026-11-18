const DAY_MS = 24 * 60 * 60 * 1000;
/** Slack around the window, as dates here are read without their time zone. */
const MARGIN_MS = 2 * DAY_MS;
/** How far before the window a repeating event is started again. */
const SKIPPED_MARGIN_MS = 14 * DAY_MS;

const EVENT = /BEGIN:VEVENT[\s\S]*?END:VEVENT(?:\r?\n)?/g;
const FOLDED = /\r?\n[ \t]/g;

const prop = (name: string) =>
  new RegExp(`^${name}(?:;[^:\\r\\n]*)?:([^\\r\\n]*)`, "m");

const UID = prop("UID");
const START = prop("DTSTART");
const END = prop("DTEND");
const RULE = prop("RRULE");
const RULE_DATES = prop("RDATE");
const DURATION = prop("DURATION");
const INSTANCE = prop("RECURRENCE-ID");

const toDay = (value: string | undefined) => {
  const match = value && /^(\d{4})(\d{2})(\d{2})/.exec(value);

  return match ? Date.UTC(+match[1], +match[2] - 1, +match[3]) : undefined;
};

type Candidate = {
  text: string;
  uid: string | undefined;
  start: number | undefined;
  end: number | undefined;
  /** Whether it repeats, and until when, when that's known. */
  isSeries: boolean;
  until: number | undefined;
  isException: boolean;
  hasDuration: boolean;
  /** How many days make one step of the series, when it's a plain daily or weekly one. */
  stepDays: number | undefined;
};

const getStepDays = (rule: string | undefined) => {
  // A count runs from the start, so a later start would change which are left.
  if (!rule || /COUNT=/.test(rule)) {
    return undefined;
  }

  const days = { DAILY: 1, WEEKLY: 7 }[/FREQ=(\w+)/.exec(rule)?.[1] as string];

  return days && days * Number(/INTERVAL=(\d+)/.exec(rule)?.[1] ?? 1);
};

const read = (text: string): Candidate => {
  const event = text.replace(FOLDED, "");
  const rule = RULE.exec(event)?.[1];

  return {
    text,
    uid: UID.exec(event)?.[1]?.trim(),
    start: toDay(START.exec(event)?.[1]),
    end: toDay(END.exec(event)?.[1]),
    isSeries: Boolean(rule) || RULE_DATES.test(event),
    until: toDay(rule && /UNTIL=(\d{8})/.exec(rule)?.[1]),
    isException: INSTANCE.test(event),
    hasDuration: DURATION.test(event),
    stepDays: getStepDays(rule),
  };
};

const DATES = /^(DTSTART|DTEND)((?:;[^:\r\n]*)?):(\d{4})(\d{2})(\d{2})/gm;

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Moves a repeating event's first day forward by whole steps, to just before
 * the window. It repeats the same way from there, without going through every
 * occurrence in between.
 */
const startLater = (
  { text, start, stepDays }: Candidate,
  windowStart: number,
) => {
  const steps =
    start !== undefined && stepDays
      ? Math.floor(
          (windowStart - SKIPPED_MARGIN_MS - start) / (stepDays * DAY_MS),
        )
      : 0;

  if (steps <= 0) {
    return text;
  }

  return text.replace(DATES, (_, name, params, year, month, day) => {
    const moved = new Date(
      Date.UTC(+year, +month - 1, +day + steps * stepDays!),
    );

    return `${name}${params}:${moved.getUTCFullYear()}${pad(moved.getUTCMonth() + 1)}${pad(moved.getUTCDate())}`;
  });
};

/**
 * Drops the events that can't show up between `from` and `to`, without reading
 * them properly. A real calendar holds years of events, and parsing all of
 * them takes seconds, while only a handful matter. Anything unclear stays.
 */
export const trimFeed = (ics: string, from: Date, to: Date): string => {
  const windowStart = from.getTime() - MARGIN_MS;
  const windowEnd = to.getTime() + MARGIN_MS;

  const candidates = [...ics.matchAll(EVENT)].map((match) => read(match[0]));

  const isNearby = ({ start, end, hasDuration }: Candidate) =>
    start === undefined ||
    (start < windowEnd && (hasDuration || (end ?? start) >= windowStart));

  // A series that began after the window, or ended before it, adds nothing.
  const isLiveSeries = ({ start, until }: Candidate) =>
    (start === undefined || start < windowEnd) &&
    (until === undefined || until >= windowStart);

  const liveUids = new Set(
    candidates
      .filter((c) => c.isSeries && !c.isException && isLiveSeries(c))
      .map(({ uid }) => uid),
  );

  const keep = (c: Candidate) => {
    if (c.isSeries && !c.isException) {
      return isLiveSeries(c) ? startLater(c, windowStart) : "";
    }

    // A changed occurrence is needed to apply to its series.
    return (c.isException && liveUids.has(c.uid)) || isNearby(c) ? c.text : "";
  };

  let index = 0;

  return ics.replace(EVENT, () => keep(candidates[index++]));
};
