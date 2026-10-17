import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { Query } from "@tanstack/react-query";
import { PersistQueryClientOptions } from "@tanstack/react-query-persist-client";
import { runtime, storage } from "webextension-polyfill";

/**
 * How long location and weather are reused across new tabs. Queries that use
 * this as `staleTime` aren't refetched within that window either.
 */
export const PERSIST_DURATION = 3 * 60 * 1000; // 3 minutes

/** Query keys (first element) that survive a new tab being opened. */
const PERSISTED_QUERIES = ["location", "weather"];

const extensionStorage = {
  getItem: async (key: string) =>
    ((await storage.local.get(key))[key] as string | undefined) ?? null,
  setItem: (key: string, value: string) => storage.local.set({ [key]: value }),
  removeItem: (key: string) => storage.local.remove(key),
};

const shouldPersistQuery = (query: Query) =>
  query.state.status === "success" &&
  PERSISTED_QUERIES.includes(String(query.queryKey[0]));

export const persistOptions: Omit<PersistQueryClientOptions, "queryClient"> = {
  persister: createAsyncStoragePersister({
    key: "queryCache",
    storage: extensionStorage,
  }),
  maxAge: PERSIST_DURATION,
  // A new extension version starts with an empty cache, in case data shapes changed.
  buster: runtime.getManifest().version,
  dehydrateOptions: { shouldDehydrateQuery: shouldPersistQuery },
};
