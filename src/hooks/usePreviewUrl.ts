import { normalizeUrl } from "@/src/utils/normalizeUrl";

import { useDebouncedValue } from "./useDebouncedValue";

/**
 * The URL a form's preview looks up an icon for. The saved URL is used as it
 * is until it's edited, so its icon comes from what the list already found,
 * and an edit waits for a pause, so half-typed addresses aren't looked up.
 */
export const usePreviewUrl = (typedUrl?: string, savedUrl?: string) => {
  const url = typedUrl ?? savedUrl ?? "";
  const debouncedUrl = useDebouncedValue(url, 500);

  return url === savedUrl ? url : normalizeUrl(debouncedUrl);
};
