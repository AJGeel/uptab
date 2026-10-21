import { withLocalPhotos } from "@/src/services/backgrounds/withLocalPhotos";

import { useCatalogue } from "./useCatalogue";
import { useLocalPhotos } from "./useLocalPhotos";

export const useBackgroundCatalogue = () => {
  const { catalogue, isPending, refresh, isRefreshing } = useCatalogue();
  const local = useLocalPhotos();

  return {
    catalogue: withLocalPhotos(catalogue, local.photos),
    remoteCatalogue: catalogue,
    localPhotos: local.photos,
    isPending: isPending || local.isPending,
    refresh,
    isRefreshing,
  };
};
