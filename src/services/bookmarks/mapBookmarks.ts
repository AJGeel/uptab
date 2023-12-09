import { Bookmarks } from "webextension-polyfill";

export const mapBookmarks = (
  bookmarkNodes: Bookmarks.BookmarkTreeNode[],
  parentId?: string
) =>
  bookmarkNodes.flatMap((node) => {
    const bookmark = {
      dateAdded: node.dateAdded,
      id: node.id,
      parentId,
      title: node.title,
      url: node.url,
    };

    const children: Bookmarks.BookmarkTreeNode[] = node.children
      ? mapBookmarks(node.children, node.id)
      : [];

    return [bookmark, ...children];
  });
