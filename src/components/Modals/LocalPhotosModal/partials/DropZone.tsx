import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { DragEvent, useRef, useState } from "react";

import { cn } from "@/src/utils";

import Button, { buttonVariants } from "../../../ui/Button";

type Props = {
  /** Shown instead of the hint, e.g. progress or the last result. */
  status: string | null;
  /** From 0 to 1 while adding, shown as a bar. */
  progress: number | null;
  isBusy: boolean;
  /** Larger, for when there are no photos yet. */
  isEmpty: boolean;
  onFiles: (files: File[]) => void;
};

/** Add photos by dropping them, or by picking files or a whole folder. */
const DropZone = ({ status, progress, isBusy, isEmpty, onFiles }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    if (!isBusy) {
      onFiles([...event.dataTransfer.files]);
    }
  };

  const onChange = (input: HTMLInputElement | null) => {
    onFiles([...(input?.files ?? [])]);

    // Lets the same files or folder be picked again.
    if (input) {
      input.value = "";
    }
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setIsDragging(false);
        }
      }}
      onDrop={onDrop}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-black/20 p-4 text-center duration-150",
        isEmpty && "py-12",
        isDragging && "border-sky-500 bg-sky-50",
      )}
    >
      {isEmpty && <ArrowUpTrayIcon className="size-8 text-gray-500" />}
      <p className="text-sm text-gray-700" aria-live="polite">
        {status ?? "Drop photos here, or"}
      </p>
      {progress !== null && (
        <div
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-black/10"
        >
          <div
            className="h-full rounded-full bg-sky-500 transition-[width] duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}
      <div className="flex gap-2">
        <Button
          label="Choose photos"
          disabled={isBusy}
          onClick={() => fileInputRef.current?.click()}
        />
        <Button
          label="Choose folder"
          variant={buttonVariants.secondary}
          title="Adding the same folder again only adds its new photos"
          disabled={isBusy}
          onClick={() => folderInputRef.current?.click()}
        />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(event) => onChange(event.currentTarget)}
      />
      <input
        // Not in React's types, so it's set directly.
        ref={(input) => {
          folderInputRef.current = input;
          input?.setAttribute("webkitdirectory", "");
        }}
        type="file"
        hidden
        onChange={(event) => onChange(event.currentTarget)}
      />
    </div>
  );
};

export default DropZone;
