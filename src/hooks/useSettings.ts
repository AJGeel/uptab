import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { editSettings } from "../services/settings/editSettings";
import { getSettings } from "../services/settings/getSettings";
import { Settings } from "../services/settings/types";

export const useSettings = () => {
  const queryClient = useQueryClient();

  const { isPending, isError, data } = useQuery({
    queryFn: async () => {
      const settings = await getSettings();

      return settings;
    },
    queryKey: ["settings"],
  });

  const editMutation = useMutation({
    mutationFn: async (newSettings: Settings) => {
      await editSettings(newSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  return {
    isPending,
    isError,
    data,
    editMutation,
  };
};
