import { GlobeIcon } from "@phosphor-icons/react";

import { SEARCH_ENGINE_ICONS } from "@/src/services/search/searchEngineIcons";
import { SearchEngineId } from "@/src/services/search/searchEngines";
import { cn } from "@/src/utils";

type Props = {
  engine: SearchEngineId;
  className?: string;
};

/** The search engine's logo, or a globe for one without. */
const SearchEngineIcon = ({ engine, className }: Props) => {
  const icon = SEARCH_ENGINE_ICONS[engine];

  if (!icon) {
    return <GlobeIcon aria-hidden className={cn("size-4", className)} />;
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      fill={icon.color}
      className={cn("size-4 shrink-0", className)}
    >
      <path d={icon.path} />
    </svg>
  );
};

export default SearchEngineIcon;
