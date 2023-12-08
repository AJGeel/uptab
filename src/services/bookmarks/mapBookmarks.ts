import { Bookmarks } from "webextension-polyfill";

export const mapBookmarks = (
  bookmarkNodes: Bookmarks.BookmarkTreeNode[],
  parentId?: string
) => {
  return bookmarkNodes.flatMap((node) => {
    const bookmark = {
      id: node.id,
      parentId,
      title: node.title,
      url: node.url,
      dateAdded: node.dateAdded,
    };

    const children: Bookmarks.BookmarkTreeNode[] = node.children
      ? mapBookmarks(node.children, node.id)
      : [];

    return [bookmark, ...children];
  });
};
