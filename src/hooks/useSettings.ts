import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { defaultSettings } from "../services/settings/defaultSettings";
import { editSettings } from "../services/settings/editSettings";
import { getSettings } from "../services/settings/getSettings";
import {
  HomescreenSettings,
  Settings,
  SidebarSettings,
} from "../services/settings/types";

const SETTINGS_QUERY_KEY = ["settings"] as const

export const useSettings = () => {
  const queryClient = useQueryClient();

  const { isPending, isError, data } = useQuery({
    queryFn: async () => {
      const settings = await getSettings();

      return settings;
    },
    queryKey: SETTINGS_QUERY_KEY,
  });

  const editMutation = useMutation({
    mutationFn: async (newSettings: Settings) => {
      await editSettings(newSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
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
