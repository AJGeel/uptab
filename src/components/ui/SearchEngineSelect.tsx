import { tabs, runtime } from "webextension-polyfill";

import { buildFeedbackUrl } from "@/src/services/feedback/feedbackUrl";
import {
  SEARCH_ENGINES,
  SearchEngineId,
  getSearchEngineLabel,
} from "@/src/services/search/searchEngines";
import { cn } from "@/src/utils";

import SearchEngineIcon from "./SearchEngineIcon";
import Select from "./Select";

type Props = {
  value: SearchEngineId;
  onValueChange: (engine: SearchEngineId) => void;
  className?: string;
};

/** Picks where web searches go. The last option is a way to ask for another one. */
const SearchEngineSelect = ({ value, onValueChange, className }: Props) => (
  <Select
    ariaLabel="Web search"
    value={value}
    options={SEARCH_ENGINES.map(({ id, label }) => ({
      value: id,
      label,
      icon: <SearchEngineIcon engine={id} />,
    }))}
    isIconFirst
    triggerLabel={
      <span className="flex items-center gap-2 whitespace-nowrap">
        <SearchEngineIcon engine={value} />
        {getSearchEngineLabel(value)}
      </span>
    }
    action={{
      label: "Missing yours? Let me know",
      onClick: () =>
        void tabs.create({
          url: buildFeedbackUrl(
            runtime.getManifest().version,
            navigator.userAgent,
          ),
        }),
    }}
    className={cn(className)}
    onValueChange={(next) => onValueChange(next as SearchEngineId)}
  />
);

export default SearchEngineSelect;
