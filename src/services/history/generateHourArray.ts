/** Generates an array that contains ["23", "22" ..., "01", "00"] */
export const generateHourArray = () =>
  Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")).reverse();
