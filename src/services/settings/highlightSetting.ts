/**
 * Marks what a setting changes on the page. Elements that belong to a setting
 * carry its id in `data-setting` (several ids, separated by spaces, for an
 * element that more settings change); they get `data-setting-hover`, which
 * tailwind.css draws as an outline in the accent colour.
 */
export const highlightSetting = (id: string | null) => {
  for (const element of document.querySelectorAll("[data-setting-hover]")) {
    element.removeAttribute("data-setting-hover");
  }

  if (!id) {
    return;
  }

  for (const element of document.querySelectorAll(`[data-setting~="${id}"]`)) {
    element.setAttribute("data-setting-hover", "");
  }
};
