import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addLocalPhotos,
  clearLocalPhotos,
  deleteLocalPhotos,
  getLocalPhotos,
} from "@/src/services/backgrounds/localPhotos";

const LOCAL_PHOTOS_QUERY_KEY = ["localPhotos"] as const;

/** Photos the user added from their computer, kept in IndexedDB. */
export const useLocalPhotos = () => {
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: LOCAL_PHOTOS_QUERY_KEY,
    queryFn: getLocalPhotos,
    staleTime: Infinity,
    networkMode: "always", // Reads IndexedDB only, so don't pause while the browser is offline.
  });

  const onSettled = () =>
    queryClient.invalidateQueries({ queryKey: LOCAL_PHOTOS_QUERY_KEY });
  const options = { onSettled, networkMode: "always" } as const;

  const add = useMutation({
    mutationFn: ({
      files,
      onProgress,
    }: {
      files: File[];
      onProgress?: (done: number) => void;
    }) => addLocalPhotos(files, onProgress),
    ...options,
  });
  const remove = useMutation({ mutationFn: deleteLocalPhotos, ...options });
  const clear = useMutation({ mutationFn: clearLocalPhotos, ...options });

  return {
    photos: data ?? [],
    isPending,
    addPhotos: add.mutateAsync,
    isAdding: add.isPending,
    removePhotos: remove.mutateAsync,
    clearPhotos: clear.mutateAsync,
  };
};
