import { Icon } from "@phosphor-icons/react";
import { ReactNode } from "react";

import Kbd from "@/src/components/ui/Kbd";
import { Switch } from "@/src/components/ui/Switch";
import { useSettingHighlight } from "@/src/hooks/useSettingHighlight";

import Highlight from "./Highlight";

type Props = {
  icon: Icon;
  /** What the setting changes is outlined on the page while it's hovered or focused. */
  settingId?: string;
  title: string;
  description: string;
  query: string;
  /** The key that does the same from anywhere, as it appears on the keyboard. */
  hotkey?: string;
  /** The control on the right. Without one, the row is a switch. */
  children?: ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
  onToggle?: () => void;
};

const SettingRow = ({
  icon: RowIcon,
  settingId,
  title,
  description,
  query,
  hotkey,
  children,
  isActive = false,
  isDisabled = false,
  onToggle,
}: Props) => {
  const highlightProps = useSettingHighlight(settingId);

  return (
    <div
      className={`group flex items-center gap-3 rounded-xl p-3 duration-150 ${isDisabled ? "opacity-50" : `hover:bg-black/5 ${onToggle ? "cursor-pointer" : ""}`}`}
      onClick={isDisabled ? undefined : onToggle}
      {...highlightProps}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-800">
        <RowIcon weight="duotone" className="size-5" />
      </span>

      <div className="flex grow flex-col">
        <h3 className="flex items-center gap-2 font-semibold">
          <Highlight text={title} query={query} />
          {hotkey && (
            <span>
              <span className="sr-only">Hotkey: </span>
              <Kbd size="inline">{hotkey}</Kbd>
            </span>
          )}
        </h3>
        <p className="text-sm text-gray-700">
          <Highlight text={description} query={query} />
        </p>
      </div>

      {onToggle ? (
        <Switch
          checked={isActive}
          disabled={isDisabled}
          aria-label={title}
          onCheckedChange={onToggle}
          // The row toggles too, so this would toggle twice.
          onClick={(event) => event.stopPropagation()}
        />
      ) : (
        children
      )}
    </div>
  );
};

export default SettingRow;
