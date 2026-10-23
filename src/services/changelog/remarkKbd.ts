/* The few fields of Markdown tree nodes this needs. */
type Node = {
  type: string;
  value?: string;
  children?: Node[];
  data?: object;
};

const isHtml = (node: Node | undefined, value: string) =>
  node?.type === "html" && node.value === value;

const replaceKeys = (node: Node) => {
  if (!node.children) {
    return;
  }

  const children: Node[] = [];

  for (let index = 0; index < node.children.length; index++) {
    const [open, text, close] = node.children.slice(index, index + 3);

    if (
      isHtml(open, "<kbd>") &&
      text?.type === "text" &&
      isHtml(close, "</kbd>")
    ) {
      children.push({
        type: "kbd",
        data: {
          hName: "kbd",
          hChildren: [{ type: "text", value: text.value }],
        },
      });
      index += 2;
    } else {
      replaceKeys(node.children[index]);
      children.push(node.children[index]);
    }
  }

  node.children = children;
};

/**
 * Lets the changelog mark keyboard keys as `<kbd>B</kbd>`, which GitHub also
 * renders as keys. react-markdown would otherwise show the tags as text.
 */
export const remarkKbd = () => replaceKeys;
