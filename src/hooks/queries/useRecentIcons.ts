import { useQuery } from "@tanstack/react-query";

import { getRecentIcons } from "@/src/services/recentIcons";

export const RECENT_ICONS_QUERY_KEY = ["recentIcons"] as const;

export const useRecentIcons = () =>
  useQuery({
    queryFn: getRecentIcons,
    queryKey: RECENT_ICONS_QUERY_KEY,
  });
