import { Popover } from "@base-ui/react/popover";
import {
  ClockCounterClockwiseIcon,
  SmileyIcon,
  XIcon,
} from "@phosphor-icons/react";
import { lazy, Suspense, useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

import { useRecentIcons } from "@/src/hooks/queries/useRecentIcons";
import { validateIcon } from "@/src/utils/icon";

import Favicon from "../ui/Favicon";
import Spinner from "../ui/Spinner";

// Its emoji data is large, so it only loads when the picker opens.
const EmojiMartPicker = lazy(() => import("./EmojiMartPicker"));

type InputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

const popupClassName =
  "origin-(--transform-origin) rounded-xl border bg-white text-black shadow-lg outline-hidden transition-[opacity,translate] duration-150 ease-out data-ending-style:-translate-y-1 data-ending-style:opacity-0 data-starting-style:-translate-y-1 data-starting-style:opacity-0";

const triggerClassName =
  "flex w-10 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white shadow-sm ring-sky-500 duration-150 hover:bg-sky-500/10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden active:scale-95 disabled:pointer-events-none disabled:opacity-40";

const IconInput = ({ id, value, onChange, error }: InputProps) => {
  const [isRecentOpen, setIsRecentOpen] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const { data: recentIcons = [] } = useRecentIcons();

  const choose = (icon: string) => {
    onChange(icon);
    setIsRecentOpen(false);
    setIsEmojiOpen(false);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            id={id}
            value={value}
            placeholder="Image URL or emoji (optional)"
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`inline-flex w-full items-center justify-center rounded-lg border bg-white py-2 pr-9 pl-3 leading-none shadow-sm ring-sky-500 outline-hidden duration-150 focus:ring-2 focus:ring-offset-2 ${error ? "border-red-400 focus:ring-red-400" : "border-gray-300"}`}
            onChange={(event) => onChange(event.target.value)}
          />
          {value && (
            <button
              type="button"
              aria-label="Clear icon"
              className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 duration-150 hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-sky-500 active:scale-90"
              onClick={() => onChange("")}
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>

        <Popover.Root open={isRecentOpen} onOpenChange={setIsRecentOpen}>
          <Popover.Trigger
            aria-label="Recently used images"
            disabled={recentIcons.length === 0}
            className={triggerClassName}
          >
            <ClockCounterClockwiseIcon className="size-5" />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner sideOffset={6} className="z-50">
              <Popover.Popup className={`${popupClassName} w-80 p-1`}>
                <p className="px-3 py-1.5 text-xs font-semibold text-gray-500">
                  Recently used
                </p>
                <ul>
                  {recentIcons.map((icon) => (
                    <li key={icon}>
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm duration-150 hover:bg-sky-500/10 hover:text-sky-800 focus-visible:bg-sky-500/10 focus-visible:text-sky-800 focus-visible:outline-hidden"
                        onClick={() => choose(icon)}
                      >
                        <Favicon icon={icon} className="size-5 shrink-0" />
                        <span className="truncate">{icon}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>

        <Popover.Root open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
          <Popover.Trigger
            aria-label="Choose an emoji"
            className={triggerClassName}
          >
            <SmileyIcon className="size-5" />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner sideOffset={6} className="z-50">
              <Popover.Popup className={`${popupClassName} overflow-hidden`}>
                <Suspense
                  fallback={
                    <div className="flex size-72 items-center justify-center">
                      <Spinner className="" />
                    </div>
                  }
                >
                  <EmojiMartPicker onSelect={choose} />
                </Suspense>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

type Props<T extends FieldValues> = {
  id: string;
  control: Control<T>;
  name: Path<T>;
};

/** The label is up to the form, which links it with the same `id`. */
const IconField = <T extends FieldValues>({ id, control, name }: Props<T>) => (
  <Controller
    control={control}
    name={name}
    rules={{ validate: validateIcon }}
    render={({ field, fieldState }) => (
      <IconInput
        id={id}
        value={field.value ?? ""}
        onChange={field.onChange}
        error={fieldState.error?.message}
      />
    )}
  />
);

export default IconField;
