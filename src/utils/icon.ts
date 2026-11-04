/** A custom icon is an image URL or a single emoji. */
export const isImageUrl = (icon: string) =>
  /^(https?:|data:image\/)/i.test(icon);

const graphemes = (text: string) =>
  [...new Intl.Segmenter().segment(text)].map(({ segment }) => segment);

export const isEmoji = (icon: string) => {
  const parts = graphemes(icon);

  return (
    parts.length === 1 &&
    /\p{Extended_Pictographic}|\p{Regional_Indicator}|\u20E3/u.test(icon)
  );
};

/** Returns true when fine, otherwise what's wrong. An empty icon is fine. */
export const validateIcon = (icon: string) => {
  const value = icon.trim();

  if (!value || isEmoji(value)) {
    return true;
  }

  try {
    return (
      (isImageUrl(value) && !!new URL(value)) ||
      "Enter an image URL or choose an emoji"
    );
  } catch {
    return "Enter an image URL or choose an emoji";
  }
};
