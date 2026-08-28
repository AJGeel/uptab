
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
};

export function usePersistedState<T>(
    key: string,
    initialValue: T | (() => T),
    options: PersistedStateOptions<T> = {},
) {
    const getInitialValue = useCallback(
        () => (initialValue instanceof Function ? initialValue() : initialValue),
        [initialValue],
    );

    const [state, setState] = useState<T>(getInitialValue);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            const result = await storage.local.get(key);

            if (cancelled) {
                return;
            }

            if (result[key] !== undefined) {
                const value = options.deserialize
                    ? options.deserialize(result[key])
                    : (result[key] as T);

                setState(value);
            }

            setIsHydrated(true);
        };

        void load();

        return () => {
            cancelled = true;
        };
    }, [key, options.deserialize]);

    const setPersistedState = useCallback(
        (value: SetStateAction<T>) => {
            setState((prevState) => {
                const nextState =
                    value instanceof Function ? value(prevState) : value;

                const valueToStore = options.serialize
                    ? options.serialize(nextState)
                    : nextState;

                void storage.local.set({
                    [key]: valueToStore,
                });

                return nextState;
            });
        },
        [key, options.serialize],
    );

    return [state, setPersistedState, isHydrated] as const;
}
