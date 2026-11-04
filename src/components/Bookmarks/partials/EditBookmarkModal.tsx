import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Bookmarks } from "webextension-polyfill";

import { usePreviewUrl } from "@/src/hooks/usePreviewUrl";
import { normalizeUrl } from "@/src/utils/normalizeUrl";

import BookmarkItem from "./BookmarkItem";
import IconField from "../../IconField/IconField";
import Button, { buttonVariants } from "../../ui/Button";
import Modal from "../../ui/Modal";

export type BookmarkChanges = {
  title: string;
  url: string;
  icon: string;
};

type Props = {
  bookmark?: Bookmarks.BookmarkTreeNode;
  icon?: string;
  isVisible: boolean;
  isSaving: boolean;
  onSave: (changes: BookmarkChanges) => void;
  onDelete: () => void;
  onClose: () => void;
};

const isValidUrl = (url: string) => {
  try {
    return !!new URL(url);
  } catch {
    return false;
  }
};

const inputClassName = (hasError: boolean) =>
  `inline-flex w-full items-center justify-center rounded-lg border bg-white px-3 py-2 leading-none shadow-sm ring-sky-500 outline-hidden duration-150 focus:ring-2 focus:ring-offset-2 ${hasError ? "border-red-400 focus:ring-red-400" : "border-gray-300"}`;

const EditBookmarkModal = ({
  bookmark,
  icon,
  isVisible,
  isSaving,
  onSave,
  onDelete,
  onClose,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<BookmarkChanges>();

  const previewValues = useWatch({ control });
  const previewUrl = usePreviewUrl(previewValues.url, bookmark?.url);

  useEffect(() => {
    reset({
      title: bookmark?.title ?? "",
      url: bookmark?.url ?? "",
      icon: icon ?? "",
    });
  }, [bookmark, icon, reset]);

  const submit = ({ title, url, icon }: BookmarkChanges) =>
    onSave({
      title: title.trim(),
      icon: icon.trim(),
      // Only a changed URL is tidied up, so odd ones (like browser pages) survive.
      url: url.trim() === bookmark?.url ? url.trim() : normalizeUrl(url.trim()),
    });

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      title="Edit bookmark"
      subtitle="Changes carry over to your browser's bookmarks too."
      className="max-w-3xl"
    >
      <div className="mt-4 grid grid-cols-2 gap-8">
        <div className="pointer-events-none flex flex-col gap-2 self-start rounded-xl bg-black/5 p-3">
          <p className="text-sm font-semibold text-gray-500">Preview</p>
          {bookmark && (
            <div className="overflow-hidden rounded-lg bg-white">
              <BookmarkItem
                item={{
                  ...bookmark,
                  title: previewValues.title || "…",
                  url: previewUrl,
                }}
                icon={(previewValues.icon ?? icon)?.trim()}
                id="bookmark-preview"
                isHighlighted={false}
                displayMode="NewTab"
                handleEdit={() => {}}
                handleDelete={() => {}}
              />
            </div>
          )}
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
          <div className="flex flex-col gap-1">
            <label
              className="font-semibold text-gray-700"
              htmlFor="bookmark-title"
            >
              Title
            </label>
            <input
              id="bookmark-title"
              autoFocus
              aria-invalid={!!errors.title}
              className={inputClassName(!!errors.title)}
              {...register("title", { validate: (value) => !!value.trim() })}
            />
            {errors.title && (
              <p className="text-xs text-red-500" role="alert">
                A bookmark needs a title
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label
              className="font-semibold text-gray-700"
              htmlFor="bookmark-url"
            >
              URL
            </label>
            <input
              id="bookmark-url"
              aria-invalid={!!errors.url}
              className={inputClassName(!!errors.url)}
              {...register("url", {
                validate: (value) =>
                  value.trim() === bookmark?.url ||
                  isValidUrl(normalizeUrl(value.trim())),
              })}
            />
            {errors.url && (
              <p className="text-xs text-red-500" role="alert">
                Please enter a valid URL
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label
              className="font-semibold text-gray-700"
              htmlFor="bookmark-icon"
            >
              Custom icon
            </label>
            <IconField id="bookmark-icon" control={control} name="icon" />
            <p className="text-xs text-gray-500">Only used inside UpTab.</p>
          </div>
          <div className="mt-2 flex items-center justify-end gap-2">
            <Button
              label="Delete"
              type="button"
              variant={buttonVariants.secondary}
              onClick={onDelete}
            />
            <Button label="Save" disabled={isSaving} />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditBookmarkModal;
