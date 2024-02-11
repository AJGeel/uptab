export const normalizeUrl = (url: string) => {
  try {
    // Add 'https://' as default protocol if missing
    const fullUrl =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`;

    const parsedUrl = new URL(fullUrl);

    // Check if the URL starts with 'www.'
    if (parsedUrl.hostname.startsWith("www.")) {
      // Remove 'www.'
      parsedUrl.hostname = parsedUrl.hostname.slice(4);
    }

    return parsedUrl.href;
  } catch (error) {
    return url;
  }
};
