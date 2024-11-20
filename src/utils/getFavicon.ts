export const getFavicon = (url: string, size = 64) =>
  `https://www.google.com/s2/favicons?domain=${url}&sz=${size}`;

export const getDdgFavicon = (url: string) =>
  `https://icons.duckduckgo.com/ip3/${url}.ico`;
