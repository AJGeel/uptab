import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import { describe, expect, it } from "vitest";

import { remarkKbd } from "./remarkKbd";

const render = (markdown: string) =>
  renderToStaticMarkup(
    <ReactMarkdown
      remarkPlugins={[remarkKbd]}
      components={{
        kbd: ({ children }) => <kbd data-key>{children}</kbd>,
      }}
    >
      {markdown}
    </ReactMarkdown>,
  );

describe("remarkKbd", () => {
  it("renders <kbd> as a key", () => {
    expect(render("Press <kbd>B</kbd> to start")).toBe(
      '<p>Press <kbd data-key="true">B</kbd> to start</p>',
    );
  });

  it("renders several keys, symbols and keys inside lists", () => {
    const html = render(
      "- Use <kbd>←</kbd> and <kbd>→</kbd>\n  - or <kbd>Esc</kbd>",
    );

    expect(html.match(/<kbd data-key="true">/g)).toHaveLength(3);
    expect(html).toContain('<kbd data-key="true">←</kbd>');
    expect(html).toContain("<li>or ");
  });

  it("leaves other HTML, and unfinished tags, alone", () => {
    expect(render("A <kbd>B and <b>C</b>")).not.toContain("data-key");
  });
});
