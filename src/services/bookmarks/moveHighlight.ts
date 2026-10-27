/** Where the highlight goes on <kbd>↑</kbd> or <kbd>↓</kbd>, stopping at the ends. */
export const moveHighlight = (
  current: number | undefined,
  key: "ArrowDown" | "ArrowUp",
  length: number,
) => {
  if (length === 0) {
    return undefined;
  }

  if (current === undefined) {
    return key === "ArrowDown" ? 0 : length - 1;
  }

  const clamped = Math.min(current, length - 1);

  return key === "ArrowDown"
    ? Math.min(clamped + 1, length - 1)
    : Math.max(clamped - 1, 0);
};
