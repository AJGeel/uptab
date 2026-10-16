/**
 * The chart pulls in recharts, so it's split out of the new tab bundle.
 * Calling this early (e.g. on hover) preloads it before the modal opens.
 */
export const loadForecastChart = () => import("./ForecastChart");
