import { QueryTarget } from "@/src/services/search/resolveQuery";
import { SearchEngineId } from "@/src/services/search/searchEngines";

import Kbd from "../../ui/Kbd";
import SearchEngineSelect from "../../ui/SearchEngineSelect";

const accent = (percent: number) =>
  `color-mix(in oklab, var(--color-sky-500) ${percent}%, transparent)`;

/*
 * A faint dot grid in the accent colour, faded out towards the middle so the
 * text on top stays easy to read.
 */
const patternStyle = {
  backgroundImage: `radial-gradient(circle, ${accent(22)} 1.25px, transparent 1.75px)`,
  backgroundSize: "20px 20px",
  maskImage: "radial-gradient(ellipse at center, transparent 15%, black 95%)",
  WebkitMaskImage:
    "radial-gradient(ellipse at center, transparent 15%, black 95%)",
} as const;

type Props = {
  query: string;
  target?: QueryTarget;
  engine: SearchEngineId;
  onEngineChange: (engine: SearchEngineId) => void;
  /** What Enter does, for the key on screen. */
  onOpen: () => void;
};

/** Nothing matched: offers the web instead, with the engine to search it with. */
const NoMatches = ({
  query,
  target,
  engine,
  onEngineChange,
  onOpen,
}: Props) => {
  const isAddress = target?.kind === "address";

  return (
    <div className="relative isolate flex h-full flex-col items-center justify-center gap-6 overflow-hidden px-4 py-6 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={patternStyle}
      />
      <div className="flex max-w-full flex-col gap-0.5">
        <p className="font-semibold">
          Nothing in your bookmarks matches
          {query.trim() && (
            <>
              {" "}
              <span className="break-all text-gray-600">
                &ldquo;{query.trim()}&rdquo;
              </span>
            </>
          )}
        </p>
        <p className="text-sm text-gray-600">
          Press{" "}
          <Kbd size="inline" onClick={onOpen}>
            Enter
          </Kbd>{" "}
          {isAddress ? "to open it as a web address." : "to search the web."}
        </p>
      </div>

      {!isAddress && (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          Search with
          <SearchEngineSelect value={engine} onValueChange={onEngineChange} />
        </div>
      )}
    </div>
  );
};

export default NoMatches;
