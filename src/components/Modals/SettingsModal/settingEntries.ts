import { generalEntries } from "./settingEntriesGeneral";
import { layoutEntries } from "./settingEntriesLayout";
import { SettingEntry } from "./settingsTypes";

export const settingEntries: SettingEntry[] = [
  ...layoutEntries,
  ...generalEntries,
];
