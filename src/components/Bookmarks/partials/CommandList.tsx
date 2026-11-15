import { Command } from "@/src/services/bookmarks/commands";
import { cn } from "@/src/utils";

type Props = {
  commands: Command[];
  activeCommand?: Command;
  getId: (command: Command) => string;
  onRun: (command: Command) => void;
};

/** The commands a colon in the search box offers. */
const CommandList = ({ commands, activeCommand, getId, onRun }: Props) => (
  <div id="bookmarks-list" role="listbox" aria-label="Commands">
    {commands.map((command) => {
      const isActive = command === activeCommand;

      return (
        <button
          key={command.name}
          id={getId(command)}
          type="button"
          role="option"
          aria-selected={isActive}
          tabIndex={-1}
          className={cn(
            "flex w-full scroll-mt-9 items-center gap-3 px-2 py-1.5 text-left text-gray-600 duration-150 hover:bg-sky-500/10 hover:text-sky-800 dark:hover:bg-sky-500/25 dark:hover:text-sky-300",
            isActive &&
              "bg-sky-500/10 text-sky-800 dark:bg-sky-500/25 dark:text-sky-300",
          )}
          onClick={() => onRun(command)}
        >
          <span className="font-bold text-sky-600">:{command.name}</span>
          <span className="grow truncate text-sm">{command.description}</span>
          {command.short && (
            <span className="text-xs text-gray-400">:{command.short}</span>
          )}
        </button>
      );
    })}
  </div>
);

export default CommandList;
