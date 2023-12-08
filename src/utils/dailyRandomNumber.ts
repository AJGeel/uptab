export const dailyRandomNumber = (min: number, max: number) => {
  const seed = new Date().getDate() * Math.pow(9, 18);
  const normalizedValue = Math.sin(seed);

  return Math.round(min + (normalizedValue + 1) * 0.5 * (max - min));
};
