import { CalendarDotsIcon } from "@phosphor-icons/react";

import { SettingEntry } from "./settingsTypes";

export const calendarEntries: SettingEntry[] = [
  {
    kind: "custom",
    id: "calendar.connection",
    section: "calendar",
    content: "calendarConnection",
    title: "Your events",
    description: "See what's next from Google Calendar. Read-only.",
    keywords: [
      "google",
      "agenda",
      "events",
      "connect",
      "disconnect",
      "secret address",
      "meeting",
      "schedule",
    ],
    icon: CalendarDotsIcon,
  },
];
