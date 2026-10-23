import { Select as BaseSelect } from "@base-ui/react/select";
import { CaretUpDownIcon, CheckIcon } from "@phosphor-icons/react";
import { ReactNode, useState } from "react";

import { cn } from "@/src/utils";

import Tooltip from "./Tooltip";

type Option = {
  value: string;
  label: string;
  icon?: ReactNode;
};

type Action = {
  label: string;
  onClick: () => void;
};

type Props = {
  value: string;
  options: Option[];
  onValueChange: (value: string) => void;
  /** Shown in the trigger, instead of the selected option's label. */
  triggerLabel?: ReactNode;
  /** A button below the options, which doesn't change the value. */
  action?: Action;
  ariaLabel: string;
  /** Explains the select, after a long hover. */
  tooltip?: string;
  className?: string;
};

const Select = ({
  value,
  options,
  onValueChange,
  triggerLabel,
  action,
  ariaLabel,
  tooltip,
  className,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const trigger = (
    <BaseSelect.Trigger
      aria-label={ariaLabel}
      className={cn(
        "flex items-center gap-1 rounded-lg px-2 py-0.5 text-left font-medium ring-sky-500 duration-150 hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden active:scale-95",
        className,
      )}
    >
      <BaseSelect.Value>{triggerLabel}</BaseSelect.Value>
      <BaseSelect.Icon>
        <CaretUpDownIcon className="size-4 opacity-60" />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );

  return (
    <BaseSelect.Root
      open={isOpen}
      onOpenChange={setIsOpen}
      value={value}
      items={options}
      onValueChange={(next) => {
        if (next) {
          onValueChange(next);
        }
      }}
    >
      {tooltip ? <Tooltip label={tooltip}>{trigger}</Tooltip> : trigger}

      <BaseSelect.Portal>
        <BaseSelect.Positioner
          sideOffset={6}
          alignItemWithTrigger={false}
          className="z-50"
        >
          <BaseSelect.Popup className="min-w-48 origin-(--transform-origin) rounded-xl border bg-white p-1 text-black shadow-lg outline-hidden transition-[opacity,scale,translate] duration-150 ease-out data-ending-style:-translate-y-1 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:-translate-y-1 data-starting-style:scale-95 data-starting-style:opacity-0">
            <BaseSelect.List>
              {options.map((option) => (
                <BaseSelect.Item
                  key={option.value}
                  value={option.value}
                  className="flex cursor-default items-center gap-2 rounded-lg px-3 py-2 text-sm select-none data-highlighted:bg-sky-500/10 data-highlighted:text-sky-800"
                >
                  <BaseSelect.ItemIndicator className="w-4">
                    <CheckIcon className="size-4" />
                  </BaseSelect.ItemIndicator>
                  <BaseSelect.ItemText className="data-selected:font-medium">
                    {option.label}
                  </BaseSelect.ItemText>
                  {option.icon}
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>

            {action && (
              <button
                className="mt-1 w-full rounded-lg border-t border-black/10 px-3 py-2 text-left text-sm text-sky-800 duration-150 hover:bg-sky-500/10 focus-visible:bg-sky-500/10 focus-visible:outline-hidden"
                onClick={() => {
                  setIsOpen(false);
                  action.onClick();
                }}
              >
                {action.label}
              </button>
            )}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
};

export default Select;
