import { useEffect, useState } from "react";

/**
 * Turns true once the browser has nothing better to do, so work that isn't
 * needed for the first paint can wait for it. It also gives up waiting after
 * `timeoutMs`, as a busy page could otherwise hold it back for good.
 */
export const useIdle = (timeoutMs = 1000) => {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    if (typeof requestIdleCallback === "function") {
      const id = requestIdleCallback(() => setIsIdle(true), {
        timeout: timeoutMs,
      });

      return () => cancelIdleCallback(id);
    }

    const id = setTimeout(() => setIsIdle(true), 200);

    return () => clearTimeout(id);
  }, [timeoutMs]);

  return isIdle;
};
