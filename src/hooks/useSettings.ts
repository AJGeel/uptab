import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { defaultSettings } from "../services/settings/defaultSettings";
import { editSettings } from "../services/settings/editSettings";
import { getSettings } from "../services/settings/getSettings";
import {
  HomescreenSettings,
  Settings,
  SidebarSettings,
} from "../services/settings/types";

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

  const toggleSidebarSetting = async (key: keyof SidebarSettings) => {
    if (!data) {
      return;
    }

    await editMutation.mutateAsync({
      ...data,
      sidebar: {
        ...data.sidebar,
        [key]: !data.sidebar[key],
      },
    });
  };

  // TODO: Refactor, toggleSidebarSetting and toggleHomescreenSettings contain too much duplication.
  const toggleHomescreenSetting = async (key: keyof HomescreenSettings) => {
    if (!data) {
      return;
    }

    await editMutation.mutateAsync({
      ...data,
      homescreen: {
        ...data.homescreen,
        [key]: !data.homescreen[key],
      },
    });
  };

  // TODO: Add function to mutate background settings

  const resetDefaultSettings = async () => {
    await editMutation.mutateAsync(defaultSettings);
  };

  return {
    isPending,
    isError,
    data,
    toggleSidebarSetting,
    toggleHomescreenSetting,
    resetDefaultSettings,
  };
};
