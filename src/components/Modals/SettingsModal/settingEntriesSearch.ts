import { GlobeIcon } from "@phosphor-icons/react";

import { SettingEntry } from "./settingsTypes";

export const searchEntries: SettingEntry[] = [
  {
    kind: "custom",
    id: "search.engine",
    section: "sidebar",
    content: "searchEngine",
    title: "Web search",
    description:
      "Where Enter searches when no bookmark matches what you typed.",
    keywords: [
      "engine",
      "google",
      "duckduckgo",
      "ecosia",
      "find",
      "web",
      "browser",
    ],
    icon: GlobeIcon,
    isDisabled: (settings) => !settings.sidebar.showBookmarks,
  },
];
