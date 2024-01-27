export const getChromeHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "x-goog-api-version": "2",
});
