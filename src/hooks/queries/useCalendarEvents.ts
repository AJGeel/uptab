import { useQuery } from "@tanstack/react-query";

import { useCalendarConnection } from "@/src/hooks/useCalendarConnection";
import { getCalendarEvents } from "@/src/services/calendar/getCalendarEvents";

/**
 * How often events are fetched again, and how long they're reused when a tab opens.
 * The feed is the whole calendar, over a megabyte, so this is kept slow: the agenda can refresh it by hand.
 */
export const CALENDAR_REFRESH_MS = 60 * 60 * 1000;

export const useCalendarEvents = () => {
  const { isConnected } = useCalendarConnection();

  const query = useQuery({
    enabled: isConnected === true,
    queryFn: () => getCalendarEvents(),
    // Saved with the other persisted queries, which look at this key.
    queryKey: ["calendar", "events"],
    staleTime: CALENDAR_REFRESH_MS,
    refetchInterval: CALENDAR_REFRESH_MS,
    // A failed fetch is tried again at the next interval, or when a tab opens.
    retry: false,
    // Fail when offline, rather than showing the loader indefinitely.
    networkMode: "always",
  });

  return {
    isConnected,
    data: query.data,
    error: query.error,
    dataUpdatedAt: query.dataUpdatedAt,
    refetch: query.refetch,
  };
};
