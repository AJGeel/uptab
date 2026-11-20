import { calendarEntries } from "./settingEntriesCalendar";
import { generalEntries } from "./settingEntriesGeneral";
import { layoutEntries } from "./settingEntriesLayout";
import { searchEntries } from "./settingEntriesSearch";
import { SettingEntry } from "./settingsTypes";

export const settingEntries: SettingEntry[] = [
  ...layoutEntries,
  ...searchEntries,
  ...calendarEntries,
  ...generalEntries,
];
