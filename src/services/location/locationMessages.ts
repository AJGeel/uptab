import { GpsFailure } from "./types";

/** What went wrong, in a sentence. */
export const getFailureReason = (failure: GpsFailure) => {
  switch (failure) {
    case "denied":
      return "Location access is blocked.";
    case "timeout":
      return "Finding your location timed out.";
    default:
      return "Your location is unavailable.";
  }
};

/** Steps to try, where there's something to fix. */
export const getFailureHelp = (failure: GpsFailure, isFirefox: boolean) => {
  switch (failure) {
    case "denied":
      return isFirefox
        ? [
            "Click the permission icon in the address bar, next to the address.",
            "Clear the blocked Location entry, or set it to Allow.",
          ]
        : [
            "Click the icon at the left of the address bar and open Site settings.",
            "Set Location to Allow.",
          ];
    case "timeout":
      return [
        "Check your internet connection.",
        "Make sure location services are on for your device.",
      ];
    default:
      return [
        "Turn on location services in your system settings, and allow them for your browser.",
      ];
  }
};

/** "Amersfoort" for "Amersfoort, Utrecht", where space is tight. */
export const getShortAreaName = (area: string) => area.split(",")[0].trim();
