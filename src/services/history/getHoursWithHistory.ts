import { OrganisedHistory } from "./types";

export const getHoursWithHistory = (
  history?: OrganisedHistory,
  activeDay?: string
) => {
  if (!history || !activeDay) {
    return [];
  }

  const hoursMap = history.get(activeDay);

  return hoursMap ? Array.from(hoursMap.keys()) : [];
};
