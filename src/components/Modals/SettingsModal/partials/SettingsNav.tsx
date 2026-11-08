import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { KeyboardEvent, RefObject } from "react";

import { SettingsSection } from "@/src/hooks/stores/useModalStore";
import { cn } from "@/src/utils";

import Button, { buttonVariants } from "../../../ui/Button";
import { Section } from "../settingsRegistry";

type Props = {
  sections: Section[];
  activeSection: SettingsSection;
  /** How many settings match the search, per section. Without a search, nothing. */
  matchCounts?: Partial<Record<SettingsSection, number>>;
  query: string;
  onQueryChange: (query: string) => void;
  searchRef: RefObject<HTMLInputElement | null>;
  onSelect: (section: SettingsSection) => void;
  onResetEverything: () => void;
};

const SettingsNav = ({
  sections,
  activeSection,
  matchCounts,
  query,
  onQueryChange,
  searchRef,
  onSelect,
  onResetEverything,
}: Props) => {
  // Sections without a match are dimmed, and skipped by the arrow keys.
  const reachable = sections.filter(
    ({ id }) => !matchCounts || (matchCounts[id] ?? 0) > 0,
  );

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }

    event.preventDefault();

    const index = reachable.findIndex(({ id }) => id === activeSection);
    const step = event.key === "ArrowDown" ? 1 : -1;
    const next =
      reachable[(index + step + reachable.length) % reachable.length];

    if (next) {
      onSelect(next.id);
      document.getElementById(`settings-nav-${next.id}`)?.focus();
    }
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      className="flex shrink-0 flex-col gap-3 sm:sticky sm:top-0 sm:w-52 sm:self-start"
    >
      <label className="relative block">
        <span className="sr-only">Search settings</span>
        <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-500" />
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search settings..."
          className="w-full rounded-xl border bg-surface py-2 pr-3 pl-9 shadow-xs ring-sky-500 duration-150 outline-none placeholder:text-gray-500 focus-visible:ring-2 [&::-webkit-search-cancel-button]:hidden"
        />
      </label>

      <nav
        aria-label="Settings sections"
        className="-mx-1 flex gap-1 overflow-x-auto p-1 sm:flex-col sm:overflow-visible"
      >
        {sections.map(({ id, label, icon: SectionIcon }) => {
          const isActive = id === activeSection;
          const count = matchCounts?.[id];

          return (
            <button
              key={id}
              id={`settings-nav-${id}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => onSelect(id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-left font-medium whitespace-nowrap ring-sky-500 duration-150 focus-visible:ring-2 focus-visible:outline-hidden active:scale-95",
                isActive
                  ? "bg-sky-500/10 text-sky-800 dark:bg-sky-500/25 dark:text-sky-300"
                  : "text-gray-600 hover:bg-black/5",
                matchCounts && !count && "opacity-40",
              )}
            >
              <SectionIcon
                weight={isActive ? "fill" : "regular"}
                className="size-5 shrink-0"
              />
              <span className="grow">{label}</span>
              {count !== undefined && count > 0 && (
                <span className="rounded-full bg-sky-500 px-1.5 text-xs text-on-accent">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="hidden sm:block">
        <Button
          label="Reset everything"
          variant={buttonVariants.inline}
          className="text-sm"
          onClick={onResetEverything}
        />
      </div>
    </div>
  );
};

export default SettingsNav;
