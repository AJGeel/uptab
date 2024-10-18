export interface HistoryItem {
  id: string;
  url?: string;
  title?: string | null;
  lastVisitTime?: number; // Milliseconds since the epoch
  visitCount?: number;
  typedCount?: number;
}

type historyDate = string;
type historyHour = string;

export type OrganisedHistory = Map<
  historyDate,
  Map<historyHour, HistoryItem[]>
>;
