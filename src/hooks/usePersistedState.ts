import { useCallback, useEffect, useState } from "react";
import { storage } from "webextension-polyfill";

type SetStateAction<T> = T | ((prevState: T) => T);

type PersistedStateOptions<T> = {
  /**
   * Optional function to transform the value before storing it.
   * Useful if you need custom serialization.
   */
  serialize?: (value: T) => unknown;

  /**
   * Optional function to transform the stored value back into T.
   */
  deserialize?: (value: unknown) => T;

  /**
   * Where to keep it: "sync" follows the user to their other browsers, but
   * allows fewer writes (Chrome: 120 a minute), so it suits rare changes.
   */
  area?: "local" | "sync";
};

export function usePersistedState<T>(
  key: string,
  initialValue: T | (() => T),
  options: PersistedStateOptions<T> = {},
) {
  const { serialize, deserialize, area = "local" } = options;

  const getInitialValue = useCallback(
    () => (initialValue instanceof Function ? initialValue() : initialValue),
    [initialValue],
  );

  const [state, setState] = useState<T>(getInitialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const result = await storage[area].get(key);

      if (cancelled) {
        return;
      }

      if (result[key] !== undefined) {
        const value = deserialize
          ? deserialize(result[key])
          : (result[key] as T);

        setState(value);
      }

      setIsHydrated(true);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [key, deserialize, area]);

  const setPersistedState = useCallback(
    (value: SetStateAction<T>) => {
      setState((prevState) => {
        const nextState = value instanceof Function ? value(prevState) : value;

        const valueToStore = serialize ? serialize(nextState) : nextState;

        // Over sync's write limit, the change stays in this tab only.
        storage[area].set({ [key]: valueToStore }).catch(() => {});

        return nextState;
      });
    },
    [key, serialize, area],
  );

  return [state, setPersistedState, isHydrated] as const;
}
