import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import { Modals, useModalStore } from "@/src/hooks/useModalStore";
import { useShortlinkStore } from "@/src/hooks/useShortlinkStore";
import { addShortlink, deleteShortlink } from "@/src/services/shortlinks";
import { normalizeUrl } from "@/src/utils/normalizeUrl";

import FormField from "./partials/FormField";
import Modal from "../../ui/Modal";

export interface FormInputs {
  URL: string;
  Title: string;
  Subtitle: string;
}

const ShortlinksModal = () => {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: addShortlink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shortlinks"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteShortlink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shortlinks"] });
    },
  });

  const activeModal = useModalStore((state) => state.activeModal);
  const setActiveModal = useModalStore((state) => state.setActiveModal);
  const selectedShortlink = useShortlinkStore((state) => state.selected);
  const setSelectedShortlink = useShortlinkStore((state) => state.setSelected);

  const defaultValues = useMemo(
    () => ({
      Subtitle: selectedShortlink?.subtitle ?? "",
      Title: selectedShortlink?.title ?? "",
      URL: selectedShortlink?.url ?? "",
    }),
    [selectedShortlink]
  );

  const { register, handleSubmit, reset } = useForm<FormInputs>({
    defaultValues,
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const normalizedUrl = normalizeUrl(data.URL);
    reset(defaultValues);

    await addMutation.mutateAsync({
      id: selectedShortlink?.id ?? uuidv4(),
      subtitle: String(data.Subtitle),
      title: data.Title,
      url: normalizedUrl,
    });

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
    >
      <form className="mt-6 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="URL"
          register={register}
          required
          pattern={
            /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\/\S*)?$/
          }
        />
        <FormField label="Title" register={register} required />
        <FormField label="Subtitle" register={register} required={false} />

        <div className="mt-6 flex justify-end gap-2">
          {selectedShortlink && (
            <button
              className="inline-flex items-center justify-center rounded bg-white px-4 py-3 font-medium leading-none ring-sky-500 ring-offset-2 duration-150 hover:bg-gray-100 focus:outline-none focus:ring-2 active:bg-gray-200 active:ring-2"
              onClick={async (event) => {
                event.preventDefault();
                if (!selectedShortlink?.id) {
                  return;
                }

                await deleteMutation.mutateAsync(selectedShortlink.id);
                onCloseModal();
              }}
            >
              Delete
            </button>
          )}
          <button className="inline-flex items-center justify-center rounded bg-sky-500 px-4 py-3 font-medium leading-none text-white ring-sky-500 ring-offset-2 duration-150 hover:brightness-110 focus:outline-none focus:ring-2 active:ring-2 active:brightness-100">
            {selectedShortlink ? "Update link" : "Save link"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ShortlinksModal;
