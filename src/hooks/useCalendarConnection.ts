import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  connectCalendar,
  disconnectCalendar,
  getCalendarUrl,
} from "@/src/services/calendar/calendarConnection";
import {
  CalendarConnection,
  getConnection,
} from "@/src/services/calendar/providers";

const CONNECTION_QUERY_KEY = ["calendar", "connection"] as const;

/**
 * Which calendar is connected, if any. The address itself never leaves
 * storage: only the site it's on, and what that site is called.
 */
export const useCalendarConnection = () => {
  const queryClient = useQueryClient();

  const { data: connection } = useQuery({
    queryFn: async (): Promise<CalendarConnection | null> => {
      const url = await getCalendarUrl();

      return (url && getConnection(url)) || null;
    },
    queryKey: CONNECTION_QUERY_KEY,
    // Reads local storage only, so don't pause while the browser is offline.
    networkMode: "always",
    staleTime: Infinity,
  });

  /** Call straight from a click: the browser's prompt needs it. */
  const connect = (url: string) =>
    connectCalendar(url).then((isGranted) => {
      if (isGranted) {
        queryClient.setQueryData(
          CONNECTION_QUERY_KEY,
          getConnection(url) ?? null,
        );
        // Clears a "reconnect" error and any events from a previous address.
        void queryClient.invalidateQueries({
          queryKey: ["calendar", "events"],
        });
      }

      return isGranted;
    });

  const disconnect = async () => {
    await disconnectCalendar();
    // The saved events go too, not just the address.
    queryClient.removeQueries({ queryKey: ["calendar", "events"] });
    queryClient.setQueryData(CONNECTION_QUERY_KEY, null);
  };

  return {
    /** Not known until the saved address has been read. */
    isConnected: connection === undefined ? undefined : connection !== null,
    connection: connection ?? undefined,
    connect,
    disconnect,
  };
};
