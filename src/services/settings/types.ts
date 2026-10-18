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
  showPhotoCredit: boolean;
};

export type BackgroundSettings = {
  /** Enabled theme IDs from the backgrounds catalogue. */
  themes: string[];
};

export type Settings = {
  sidebar: SidebarSettings;
  homescreen: HomescreenSettings;
  backgrounds: BackgroundSettings;
};
