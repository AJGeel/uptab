import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { Query } from "@tanstack/react-query";
import {
  PersistedClient,
  PersistQueryClientOptions,
} from "@tanstack/react-query-persist-client";
import { runtime, storage } from "webextension-polyfill";

/**
 * How long location and weather are reused across new tabs. Queries that use
 * this as `staleTime` aren't refetched within that window either.
 */
export const PERSIST_DURATION = 3 * 60 * 1000; // 3 minutes

/**
 * How long saved calendar events are kept: long enough to still show what was
 * last known after a restart, or while offline.
 */
export const CALENDAR_PERSIST_DURATION = 24 * 60 * 60 * 1000;

/**
 * Query keys (first element) that survive a new tab being opened, and how long
 * each is reused for. Older than that, it's left out when the tab opens.
 */
const PERSISTED_QUERIES: Record<string, number> = {
  location: PERSIST_DURATION,
  weather: PERSIST_DURATION,
  calendar: CALENDAR_PERSIST_DURATION,
};

const extensionStorage = {
  getItem: async (key: string) =>
    ((await storage.local.get(key))[key] as string | undefined) ?? null,
  setItem: (key: string, value: string) => storage.local.set({ [key]: value }),
  removeItem: (key: string) => storage.local.remove(key),
};

/** A GPS fix without a name isn't kept, so the next tab looks the name up again. */
const isNamelessGpsFix = ({ queryKey, state }: Query) =>
  queryKey[0] === "location" &&
  queryKey[1] === "gps" &&
  !(state.data as { area?: string } | undefined)?.area;

/** The calendar's connection is read from storage each time, so only the events are kept. */
const isCalendarConnection = ({ queryKey }: Query) =>
  queryKey[0] === "calendar" && queryKey[1] !== "events";

const shouldPersistQuery = (query: Query) =>
  query.state.status === "success" &&
  String(query.queryKey[0]) in PERSISTED_QUERIES &&
  !isCalendarConnection(query) &&
  !isNamelessGpsFix(query);

const basePersister = createAsyncStoragePersister({
  key: "queryCache",
  storage: extensionStorage,
});

/** Drops what's too old for its own kind, as the cache as a whole is kept for the longest. */
export const dropOutdatedQueries = (
  client: PersistedClient,
  now = Date.now(),
): PersistedClient => ({
  ...client,
  clientState: {
    ...client.clientState,
    queries: client.clientState.queries.filter(
      ({ queryKey, state }) =>
        now - state.dataUpdatedAt <=
        (PERSISTED_QUERIES[String(queryKey[0])] ?? 0),
    ),
  },
});

export const persistOptions: Omit<PersistQueryClientOptions, "queryClient"> = {
  persister: {
    ...basePersister,
    restoreClient: async () => {
      const client = await basePersister.restoreClient();

      return client && dropOutdatedQueries(client);
    },
  },
  maxAge: CALENDAR_PERSIST_DURATION,
  // A new extension version starts with an empty cache, in case data shapes changed.
  buster: runtime.getManifest().version,
  dehydrateOptions: { shouldDehydrateQuery: shouldPersistQuery },
};
