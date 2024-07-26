import { useQuery } from "@tanstack/react-query";

import { useSettings } from "./useSettings";
import { getBackground } from "../services/background/getBackground";

export const useBackground = () => {
  const { data: settings } = useSettings();

  const {
    isPending,
    isError,
    data: backgroundImage,
  } = useQuery({
    queryFn: async () => await getBackground(settings?.background.theme),
    enabled: !!settings,
    queryKey: ["background", settings?.background.theme],
    //
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 12 * 60 * 60 * 1000, // 12 hours
    gcTime: 12 * 60 * 60 * 1000, // 12 hours
  });

  // TODO: Handle error state with a fallback image

  return {
    isPending,
    isError,
    backgroundImage,
  };
};
