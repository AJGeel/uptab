export type SidebarSettings = {
  showShortlinks: boolean;
  showBookmarks: boolean;
  showUpdates: boolean;
  showInfoWidget: boolean;
  isOpen: boolean;
};

export type HomescreenSettings = {
  showFeedbackPrompt: boolean;
  showInfoWidget: boolean;
};

export type Settings = {
  sidebar: SidebarSettings;
  homescreen: HomescreenSettings;
};
