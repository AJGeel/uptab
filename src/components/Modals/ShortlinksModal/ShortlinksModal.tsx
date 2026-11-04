import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";

import { RECENT_ICONS_QUERY_KEY } from "@/src/hooks/queries/useRecentIcons";
import { SHORTLINK_QUERY_KEY } from "@/src/hooks/queries/useShortlinks";
import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import { useShortlinkStore } from "@/src/hooks/stores/useShortlinkStore";
import { usePreviewUrl } from "@/src/hooks/usePreviewUrl";
import { addRecentIcon } from "@/src/services/recentIcons";
import {
  addShortlink,
  deleteShortlink,
  editShortlink,
  Shortlink as ShortlinkType,
} from "@/src/services/shortlinks";
import { normalizeUrl } from "@/src/utils/normalizeUrl";

import FormField from "./partials/FormField";
import IconField from "../../IconField/IconField";
import Shortlink from "../../Shortlinks/partials/Shortlink";
import Button, { buttonVariants } from "../../ui/Button";
import Modal from "../../ui/Modal";

export interface FormInputs {
  url: string;
  title: string;
  subtitle: string;
  icon: string;
}

const ShortlinksModal = () => {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: addShortlink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHORTLINK_QUERY_KEY });
    },
  });

  const editMutation = useMutation({
    mutationFn: editShortlink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHORTLINK_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteShortlink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHORTLINK_QUERY_KEY });
    },
  });

  const activeModal = useModalStore((state) => state.activeModal);
  const setActiveModal = useModalStore((state) => state.setActiveModal);
  const selectedShortlink = useShortlinkStore((state) => state.selected);
  const setSelectedShortlink = useShortlinkStore((state) => state.setSelected);

  const defaultValues = useMemo(
    () => ({
      subtitle: selectedShortlink?.subtitle ?? "",
      title: selectedShortlink?.title ?? "",
      url: selectedShortlink?.url ?? "",
      icon: selectedShortlink?.icon ?? "",
    }),
    [selectedShortlink],
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues,
  });

  const previewValues = useWatch({ control });
  const previewUrl = usePreviewUrl(previewValues.url, selectedShortlink?.url);

  const previewShortlink: ShortlinkType = {
    id: selectedShortlink?.id ?? "preview",
    subtitle: previewValues.subtitle ?? "",
    title: previewValues.title || "…",
    url: previewUrl,
    icon: (previewValues.icon ?? selectedShortlink?.icon)?.trim() || undefined,
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const normalizedUrl = normalizeUrl(data.url);
    reset(defaultValues);

    const mutation = selectedShortlink ? editMutation : addMutation;

    const payload: ShortlinkType = {
      id: selectedShortlink?.id ?? crypto.randomUUID(),
      subtitle: String(data.subtitle),
      title: data.title,
      url: normalizedUrl,
      icon: data.icon.trim() || undefined,
    };

    await mutation.mutateAsync(payload);

    if (payload.icon) {
      await addRecentIcon(payload.icon);
      queryClient.invalidateQueries({ queryKey: RECENT_ICONS_QUERY_KEY });
    }

    onCloseModal();
  };

  const onCloseModal = () => {
    setSelectedShortlink(null);
    setActiveModal(null);
  };

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset, selectedShortlink]);

  return (
    <Modal
      isVisible={activeModal === Modals.shortlink}
      title={selectedShortlink ? "Edit a link" : "Save a link"}
      subtitle={
        selectedShortlink
          ? undefined
          : "Save a link for later. You know, so you might be able to actually find it when you need it."
      }
      onClose={onCloseModal}
      className="max-w-3xl"
    >
      <div className="mt-4 grid grid-cols-5">
        <div className="pointer-events-none col-span-2 flex flex-col gap-2 self-start rounded-xl bg-black/5 p-3">
          <p className="text-sm font-semibold text-gray-500">Preview</p>
          <Shortlink item={previewShortlink} isDragging={true} />
        </div>
        <form
          className="col-span-3 flex flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormField
            autoFocus
            label="url"
            register={register}
            error={errors.url}
            required
            pattern={
              /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\/\S*)?$/
            }
          />
          <FormField
            label="title"
            register={register}
            required
            error={errors.title}
          />
          <FormField
            label="subtitle"
            register={register}
            error={errors.subtitle}
          />
          <fieldset className="mb-4 flex items-start gap-5">
            <label
              className="w-24 pt-2 text-right font-semibold text-gray-700"
              htmlFor="shortlink-icon"
            >
              Custom icon
            </label>
            <div className="flex-1">
              <IconField id="shortlink-icon" control={control} name="icon" />
            </div>
          </fieldset>

          <div className="mt-6 flex justify-end gap-2">
            {selectedShortlink && (
              <Button
                variant={buttonVariants.secondary}
                label="Delete"
                type="button"
                onClick={async (event) => {
                  event.preventDefault();
                  event.stopPropagation();

                  if (!selectedShortlink?.id) {
                    return;
                  }

                  await deleteMutation.mutateAsync(selectedShortlink.id);
                  onCloseModal();
                }}
              />
            )}
            <Button label={selectedShortlink ? "Update link" : "Save link"} />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ShortlinksModal;
