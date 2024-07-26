import { BgTheme } from "../background/types";

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

export type BackgroundSettings = {
  theme: BgTheme;
};

export type Settings = {
  background: BackgroundSettings;
  sidebar: SidebarSettings;
  homescreen: HomescreenSettings;
};
