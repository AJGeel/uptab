import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Changelog() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [changelogArticle, setChangelogArticle] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/CHANGELOG.md");

        const content = await response.text();

        setChangelogArticle(content);
      } catch (error) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (hasError) {
    return <p>Something has gone wrong.</p>;
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl p-12">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ReactMarkdown
            className="prose lg:prose-lg"
            components={{
              h1: ({ ...props }) => (
                <h1 className="text-3xl font-bold lg:text-5xl" {...props} />
              ),
              h2: ({ ...props }) => (
                <h2
                  className="mt-8 border-t border-sky-800/10 pt-8"
                  {...props}
                />
              ),
              a: ({ ...props }) => (
                <a
                  className="duration-150 hover:text-sky-400 hover:no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
            }}
          >
            {changelogArticle}
          </ReactMarkdown>
        )}
      </div>
    </main>
  );
}
