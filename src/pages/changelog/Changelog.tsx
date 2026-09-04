import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import ReactMarkdown from "react-markdown";

export const targetBlank = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

const Container = ({ children }: PropsWithChildren) => (
  <div className="min-h-screen bg-gradient-to-b from-white via-slate-200 to-slate-200">
    <div className="prose-sm mx-auto w-full max-w-3xl px-4 py-32 text-slate-700 md:px-6">
      {children}
    </div>
  </div>
);

const Changelog = () => {
  const { data, isError, isPending } = useQuery({
    queryFn: async () => {
      const response = await fetch("/CHANGELOG.md");
      const content = await response.text();

      return content;
    },
    queryKey: ["changelog"],
  });

  if (isPending) {
    return (
      <Container>
        <p>Loading...</p>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <p>Something has gone wrong.</p>
      </Container>
    );
  }

  return (
    <Container>
      <ReactMarkdown
        components={{
          h1: () => (
            <h1 className="text-2xl font-bold lg:text-3xl">
              <ArrowPathIcon className="-mt-1 mr-2 inline size-6 text-sky-500" />
              <span>UpTab Changelog</span>
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-40 flex items-center gap-2">
              <img
                src="/icon-128.png"
                width="20"
                height="20"
                alt="UpTab Logo"
                className="m-0"
              />
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="bg-black bg-clip-text font-semibold text-transparent">
              {children}
            </h3>
          ),
          a: ({ href, children }) => (
            <a
              className="font-bold text-sky-500 no-underline duration-150 hover:text-black"
              {...targetBlank}
              href={href}
            >
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="list-disc pl-8">{children}</ul>,
          code: ({ children }) => (
            <code className="rounded-md border border-black/20 bg-white px-1.5 py-1 shadow-[0px_2px_rgba(0,0,0,.1)]">
              {children}
            </code>
          ),
        }}
      >
        {data}
      </ReactMarkdown>
    </Container>
  );
};

export default Changelog;
