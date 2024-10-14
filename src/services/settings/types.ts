export type SidebarSettings = {
  showShortlinks: boolean;
  showBookmarks: boolean;
  showUpdates: boolean;
  showInfoWidget: boolean;
  showFeedbackPrompt: boolean;
  isOpen: boolean;
};

export type HomescreenSettings = {
  showInfoWidget: boolean;
};

export type Settings = {
  sidebar: SidebarSettings;
  homescreen: HomescreenSettings;
};
