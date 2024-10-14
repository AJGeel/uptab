import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";

const Changelog = () => {
  const { data, isError, isPending } = useQuery({
    queryFn: async () => {
      const response = await fetch("/CHANGELOG.md");
      const content = await response.text();

      return content;
    },
    queryKey: ["changelog"],
  });

  if (isError) {
    return <p>Something has gone wrong.</p>;
  }

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Something has gone wrong.</p>;
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl p-12">
        <ReactMarkdown
          className="prose lg:prose-lg"
          components={{
            h1: ({ ...props }) => (
              <h1 className="text-3xl font-bold lg:text-5xl" {...props} />
            ),
            h2: ({ ...props }) => (
              <h2 className="mt-8 border-t border-sky-800/10 pt-8" {...props} />
            ),
            a: ({ ...props }) => (
              <a
                className="border-b-2 pb-1 font-bold no-underline duration-150 hover:border-sky-400 hover:text-sky-400"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),
          }}
        >
          {data}
        </ReactMarkdown>
      </div>
    </main>
  );
};

export default Changelog;
