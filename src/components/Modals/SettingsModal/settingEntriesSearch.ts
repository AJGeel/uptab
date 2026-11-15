import { ChatCircleDotsIcon, GlobeIcon } from "@phosphor-icons/react";

import { field, SettingEntry } from "./settingsTypes";

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
  {
    kind: "switch",
    id: "sidebar.showFeedbackPrompt",
    section: "sidebar",
    ...field("sidebar", "showFeedbackPrompt"),
    title: "Feedback link",
    description: "A little nudge to tell the maker what you think.",
    keywords: ["prompt", "review", "rate", "bottom"],
    icon: ChatCircleDotsIcon,
  },
];
