import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { LocationSettings } from "../services/location/types";
import { defaultSettings } from "../services/settings/defaultSettings";
import { editSettings } from "../services/settings/editSettings";
import { getSettings } from "../services/settings/getSettings";
import { Settings, SidebarSettings } from "../services/settings/types";

const SETTINGS_QUERY_KEY = ["settings"] as const;

export const useSettings = () => {
  const queryClient = useQueryClient();

  const { isPending, isError, data } = useQuery({
    queryFn: async () => {
      const settings = await getSettings();

      return settings;
    },
    queryKey: SETTINGS_QUERY_KEY,
    // Reads local storage only, so don't pause while the browser is offline.
    networkMode: "always",
    /*
     * Every change goes through this hook, which updates the cache itself.
     * Without this, each component that shows up reads the settings again.
     */
    staleTime: Infinity,
  });

  const editMutation = useMutation({
    mutationFn: async (newSettings: Settings) => {
      await editSettings(newSettings);
    },
    // Shown straight away, so that quick changes in a row build on each other.
    onMutate: async (newSettings) => {
      // A read that started before this change would land after it, and undo it.
      await queryClient.cancelQueries({ queryKey: SETTINGS_QUERY_KEY });
      queryClient.setQueryData(SETTINGS_QUERY_KEY, newSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
    },
  });

  const setSidebarOpen = async (to: boolean) => {
    if (!data) {
      return;
    }

    await editMutation.mutateAsync({
      ...data,
      sidebar: {
        ...data.sidebar,
        isOpen: to,
      },
    });
  };

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

  const setBackgroundThemes = async (themes: string[]) => {
    if (!data) {
      return;
    }

    await editMutation.mutateAsync({
      ...data,
      backgrounds: { ...data.backgrounds, themes },
    });
  };

  const setLocationSettings = async (location: LocationSettings) => {
    if (!data) {
      return;
    }

    await editMutation.mutateAsync({ ...data, location });
  };

  const updateSettings = async (newSettings: Settings) => {
    await editMutation.mutateAsync(newSettings);
  };

  const resetDefaultSettings = async () => {
    await editMutation.mutateAsync(defaultSettings);
  };

  return {
    isPending,
    isError,
    data,
    toggleSidebarSetting,
    setBackgroundThemes,
    setLocationSettings,
    setSidebarOpen,
    updateSettings,
    resetDefaultSettings,
  };
};
