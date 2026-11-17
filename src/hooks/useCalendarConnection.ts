import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  connectCalendar,
  disconnectCalendar,
  getCalendarUrl,
} from "@/src/services/calendar/calendarConnection";

const CONNECTION_QUERY_KEY = ["calendar", "connection"] as const;

/** Whether a calendar is connected. The address itself never leaves storage. */
export const useCalendarConnection = () => {
  const queryClient = useQueryClient();

  const { data: isConnected } = useQuery({
    queryFn: async () => Boolean(await getCalendarUrl()),
    queryKey: CONNECTION_QUERY_KEY,
    // Reads local storage only, so don't pause while the browser is offline.
    networkMode: "always",
    staleTime: Infinity,
  });

  /** Call straight from a click: the browser's prompt needs it. */
  const connect = (url: string) =>
    connectCalendar(url).then((isGranted) => {
      if (isGranted) {
        queryClient.setQueryData(CONNECTION_QUERY_KEY, true);
      }

      return isGranted;
    });

  const disconnect = async () => {
    await disconnectCalendar();
    // The saved events go too, not just the address.
    queryClient.removeQueries({ queryKey: ["calendar", "events"] });
    queryClient.setQueryData(CONNECTION_QUERY_KEY, false);
  };

  return { isConnected, connect, disconnect };
};
