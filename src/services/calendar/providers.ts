// No imports: the manifest reads this at build time.

export type CalendarProviderId = "google" | "outlook";

export type CalendarProvider = {
  id: CalendarProviderId;
  label: string;
  /** What the path of a secret address looks like, to tell it from any other page of that site. */
  path: RegExp;
  /** The sites a secret address can be on, each with the page to open that calendar. */
  hosts: { host: string; openUrl: string }[];
};

export const CALENDAR_PROVIDERS: CalendarProvider[] = [
  {
    id: "google",
    label: "Google Calendar",
    path: /^\/calendar\/ical\/[^/]+\/(?:private-[^/]+|public)\/basic\.ics$/,
    hosts: [
      { host: "calendar.google.com", openUrl: "https://calendar.google.com" },
    ],
  },
  {
    id: "outlook",
    label: "Outlook",
    path: /^\/owa\/calendar\/[^/]+\/[^/]+\/calendar\.ics$/,
    hosts: [
      {
        host: "outlook.live.com",
        openUrl: "https://outlook.live.com/calendar/",
      },
      {
        host: "outlook.office365.com",
        openUrl: "https://outlook.office.com/calendar/",
      },
    ],
  },
];

/** The only sites UpTab can ask to read, and only once a calendar from one is connected. */
export const CALENDAR_ORIGINS = CALENDAR_PROVIDERS.flatMap(({ hosts }) =>
  hosts.map(({ host }) => `https://${host}/*`),
);

export const getProvider = (id: CalendarProviderId) =>
  CALENDAR_PROVIDERS.find((provider) => provider.id === id)!;

/** What's known about a connected calendar. Nothing in it is secret. */
export type CalendarConnection = {
  provider: CalendarProviderId;
  label: string;
  host: string;
  /** Opens the calendar in the provider's own site. */
  openUrl: string;
};

/** Which provider an address is from, by its site. `undefined` for any other. */
export const getConnection = (
  address: string,
): CalendarConnection | undefined => {
  try {
    const { protocol, hostname } = new URL(address);

    if (protocol !== "https:") {
      return undefined;
    }

    for (const provider of CALENDAR_PROVIDERS) {
      const site = provider.hosts.find(({ host }) => host === hostname);

      if (site) {
        return {
          provider: provider.id,
          label: provider.label,
          host: site.host,
          openUrl: site.openUrl,
        };
      }
    }
  } catch {
    // Not an address at all.
  }

  return undefined;
};

/** Whether an address has the shape of a secret calendar address, and not some other page of the site. */
export const hasExpectedShape = (address: string) => {
  const connection = getConnection(address);

  return Boolean(
    connection &&
    getProvider(connection.provider).path.test(new URL(address).pathname),
  );
};
