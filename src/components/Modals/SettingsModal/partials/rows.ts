import {
  HomescreenSettings,
  SidebarSettings,
} from "@/src/services/settings/types";

type SettingsRows = {
  sidebar: {
    setting: keyof SidebarSettings;
    title: string;
    description: string;
  }[];
  homescreen: {
    setting: keyof HomescreenSettings;
    title: string;
    description: string;
  }[];
};

export const rows: SettingsRows = {
  sidebar: [
    {
      setting: "showInfoWidget",
      title: "Show Info Widget",
      description: "Shows weather forecasts and date.",
    },
    {
      setting: "showShortlinks",
      title: "Show Shortlinks",
      description: "Enables quick access to configurable links.",
    },
    {
      setting: "showBookmarks",
      title: "Show Bookmarks",
      description: "Access your browser bookmarks in the sidebar.",
    },
    {
      setting: "showUpdates",
      title: "Notify when updated",
      description: "Shows an inline notification when UpTab is updated.",
    },
  ],
  homescreen: [
    {
      setting: "showInfoWidget",
      title: "Show Info Widget",
      description: "Shows weather forecasts and date.",
    },
    {
      setting: "showFeedbackPrompt",
      title: "Feedback Prompt",
      description: "Displays a link to show feedback at the right bottom",
    },
  ],
} as const;
