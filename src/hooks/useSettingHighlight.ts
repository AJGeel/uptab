import { useEffect } from "react";

import { highlightSetting } from "@/src/services/settings/highlightSetting";

/**
 * Props that outline what a setting changes on the page, while its row is
 * hovered or focused. Spread them on the row.
 */
export const useSettingHighlight = (settingId?: string) => {
  // A row that goes away while it's hovered never sees the pointer leave.
  useEffect(() => () => highlightSetting(null), []);

  if (!settingId) {
    return {};
  }

  return {
    onMouseEnter: () => highlightSetting(settingId),
    onMouseLeave: () => highlightSetting(null),
    onFocus: () => highlightSetting(settingId),
    onBlur: () => highlightSetting(null),
  };
};
