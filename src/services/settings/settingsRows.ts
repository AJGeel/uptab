import { HomescreenSettings, SidebarSettings } from "@/src/services/settings/types";

type Row<K extends PropertyKey> = {
    setting: K;
    title: string;
    description: string;
};

type RequiredRows<T> = {
    [K in keyof T]: Row<K>;
};

export const settingsRows = {
    sidebar: {
        showInfoWidget: {
            setting: "showInfoWidget",
            title: "Show Info Widget",
            description: "Shows weather forecasts and date.",
        },
        showShortlinks: {
            setting: "showShortlinks",
            title: "Show Shortlinks",
            description: "Enables quick access to configurable links.",
        },
        showBookmarks: {
            setting: "showBookmarks",
            title: "Show Bookmarks",
            description: "Access your browser bookmarks in the sidebar.",
        },
        showUpdates: {
            setting: "showUpdates",
            title: "Notify when updated",
            description: "Shows an inline notification when UpTab is updated.",
        },
        showFeedbackPrompt: {
            setting: "showFeedbackPrompt",
            title: "Feedback Prompt",
            description: "Displays a link to show feedback at the right bottom",
        },
        isOpen: {
            setting: "isOpen",
            title: "Sidebar Open",
            description: "Controls whether the sidebar is open.",
        },
    },

    homescreen: {
        showInfoWidget: {
            setting: "showInfoWidget",
            title: "Show Info Widget",
            description: "Shows weather forecasts and date.",
        },
        showPhotoCredit: {
            setting: "showPhotoCredit",
            title: "Show Photo Credit",
            description: "Shows the photo credit on the homescreen.",
        },
    },
} satisfies {
    sidebar: RequiredRows<SidebarSettings>;
    homescreen: RequiredRows<HomescreenSettings>;
};