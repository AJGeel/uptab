import { useEffect, useState } from "react";

/** The current time, as epoch milliseconds, refreshed so that countdowns stay right. */
export const useNow = (intervalMs = 15_000) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);

    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
};
