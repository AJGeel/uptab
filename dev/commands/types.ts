export type StoreStatus = {
  /** Version users currently get. */
  live?: string;
  /** Latest submitted version that isn't live yet. */
  pending?: { version: string; state: string };
};
