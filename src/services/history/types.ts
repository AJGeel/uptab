export interface HistoryItem {
  id: string;
  url?: string;
  title?: string | null;
  lastVisitTime?: number; // Milliseconds since the epoch
  visitCount?: number;
  typedCount?: number;
}

export type OrganisedHistory = Map<string, Map<string, HistoryItem[]>>;
