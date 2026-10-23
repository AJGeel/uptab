import { createContext, PropsWithChildren, use } from "react";
import ReactMarkdown, { Components } from "react-markdown";

import { remarkKbd } from "@/src/services/changelog/remarkKbd";
import { cn } from "@/src/utils";

import Kbd from "./Kbd";

type Props = {
  markdown: string;
  /** Replaces the styling of some elements, e.g. a page's own headings. */
  components?: Components;
};

/** How many lists this one is inside of, so nested bullets can be set apart. */
const ListDepthContext = createContext(0);

const List = ({ children }: PropsWithChildren) => {
  const depth = use(ListDepthContext);

  return (
    <ListDepthContext value={depth + 1}>
      <ul
        className={cn(
          "pl-5 marker:text-sky-500",
          // Sub-points hug their parent and each other, with hollow bullets.
          depth === 0
            ? "list-disc space-y-2.5"
            : "mt-1.5 list-[circle] space-y-1",
        )}
      >
        {children}
      </ul>
    </ListDepthContext>
  );
};

const components: Components = {
  h3: ({ children }) => (
    <h3 className="mt-7 mb-3 text-lg font-bold text-gray-900 first:mt-0">
      {children}
    </h3>
  ),
  ul: List,
  li: ({ children }) => (
    <li className="pl-1 leading-normal text-gray-800">{children}</li>
  ),
  kbd: ({ children }) => <Kbd>{children}</Kbd>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-sky-600 underline duration-150 hover:no-underline"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded-md border border-black/10 bg-white px-1 py-0.5 text-[0.9em]">
      {children}
    </code>
  ),
};

/**
 * Changelog Markdown in the app's style. Kept apart from the new tab's code,
 * so react-markdown loads on demand.
 */
const ChangelogMarkdown = ({ markdown, components: overrides }: Props) => (
  <ReactMarkdown
    remarkPlugins={[remarkKbd]}
    components={{ ...components, ...overrides }}
  >
    {markdown}
  </ReactMarkdown>
);

export default ChangelogMarkdown;
