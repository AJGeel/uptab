# Bookmarks

The bookmarks card (`components/Bookmarks/Bookmarks.tsx`) lists the browser's bookmarks, flat, with search and a sort. The popup is the same card without the sort control.

## Keyboard

All keys are handled on the search box (`hooks/useBookmarkNavigation.ts`), so typing keeps working. The list is an ARIA listbox; the box points at the highlighted row with `aria-activedescendant`.

| Key | Does |
| --- | --- |
| <kbd>↓</kbd> <kbd>↑</kbd> | Move the highlight (stops at the ends) |
| <kbd>Enter</kbd> | Open the highlighted bookmark |
| <kbd>Esc</kbd> | Clear the highlight |

While searching, the first result is highlighted, so <kbd>Enter</kbd> opens it.

## Sorting

The dropdown offers four fields: Name, Date added, Recently visited and Most visited (`SortFields` in `services/bookmarks/sortBookmarks.ts`). Choosing the field that's already chosen reverses Name (A-Z / Z-A) or Date added (Newest / Oldest), with a "click to reverse" hint beside the active option (`onClick` on `Select`'s options, since the dropdown doesn't report a re-pick of the same value). The visit sorts only go one way. Saved sorts keep their old values (`A-Z`, `Z-A`, `Newest`, `Oldest`, `Recent`, `Popular`).

## Sorting by visits

"Recently visited" and "Most visited" read the browser's history, so `history` is an **optional** permission (`optional_permissions` in `src/manifest.ts`). Adding a required permission would disable UpTab for everyone on update until they accept a prompt.

- Choosing one of them without access asks for it (`hooks/useHistoryAccess.ts`). The request has to be made straight from the click, so don't `await` anything before it. If it's declined, the previous sort stays and a notice says why.
- A saved visit sort without access (it was revoked) shows as "Newest" until access is back.
- `hooks/queries/useBookmarkVisits.ts` looks up each bookmark's own page with `history.getVisits`. In a Chromium test with 3,000 bookmarks it took about 170 ms, where reading the whole history with `history.search` took about 880 ms for 14,000 entries, and grows with the history. Pages are matched with a trailing slash ignored (`services/bookmarks/visits.ts`).
- Unvisited bookmarks sort last, by name.
- Each row shows what it was ranked by, in light grey on the right (`services/bookmarks/visitDetail.ts`): how long ago for "Recently visited", the total for "Most visited". It fades out when the row's actions show on hover.

Headless browsers can't answer the permission prompt, so accepting and declining it needs a manual check in Chrome and Firefox. To test the sorting itself, load a build whose manifest lists `history` under `permissions`.

For the store listings, see [store-listing/history-permission.md](store-listing/history-permission.md).
