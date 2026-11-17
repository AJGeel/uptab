import {
  CalendarDotsIcon,
  HouseIcon,
  SidebarSimpleIcon,
  VideoCameraIcon,
} from "@phosphor-icons/react";

import { field, SettingEntry } from "./settingsTypes";

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
  {
    kind: "switch",
    id: "calendar.showJoinButton",
    section: "calendar",
    ...field("calendar", "showJoinButton"),
    needsCalendar: true,
    title: "Join button",
    description: "Show Join for Meet, Zoom and Teams links.",
    keywords: ["meeting", "video", "call", "meet", "zoom", "teams", "link"],
    icon: VideoCameraIcon,
  },
  {
    kind: "switch",
    id: "calendar.showOnHomescreen",
    section: "calendar",
    ...field("calendar", "showOnHomescreen"),
    needsCalendar: true,
    title: "Show on homescreen",
    description: "Next event under the date on the homescreen.",
    keywords: ["events", "agenda", "widget", "date", "next", "background"],
    icon: HouseIcon,
  },
  {
    kind: "switch",
    id: "calendar.showInSidebar",
    section: "calendar",
    ...field("calendar", "showInSidebar"),
    needsCalendar: true,
    title: "Show in sidebar",
    description: "Next event under the date in the sidebar.",
    keywords: ["events", "agenda", "widget", "date", "next"],
    icon: SidebarSimpleIcon,
  },
];
