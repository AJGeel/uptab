import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getUpdateNotification } from "@/src/services/updateNotification/getUpdateNotification";
import { setUpdateNotification } from "@/src/services/updateNotification/setUpdateNotification";

const queryKey = ["updateNotification"];

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();

  // Shared, so hiding the notification in one place hides it everywhere.
  const { data: isVisible = false } = useQuery({
    queryKey,
    queryFn: async () => !!(await getUpdateNotification()).newUpdate,
    staleTime: Infinity,
    networkMode: "always",
  });

  const onHide = () => {
    queryClient.setQueryData(queryKey, false);
    setUpdateNotification(false);
  };

  return {
    isVisible,
    onHide,
  };
};
