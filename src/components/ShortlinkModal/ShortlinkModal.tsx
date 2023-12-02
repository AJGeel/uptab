import React, { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { XMarkIcon } from "@heroicons/react/24/solid";
import useModalStore from "@src/hooks/useModalStore";
import { Path, SubmitHandler, UseFormRegister, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { addShortlink, deleteShortlink } from "@src/services/shortlinks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { normalizeUrl } from "@src/utils/normalizeUrl";

interface FormInputs {
  URL: string;
  Title: string;
  Subtitle: string;
}

type FormFieldProps = {
  label: Path<FormInputs>;
  register: UseFormRegister<FormInputs>;
  required: boolean;
  maxLength?: number;
  pattern?: RegExp;
};

const FormField = ({
  label,
  register,
  required,
  maxLength,
  pattern,
}: FormFieldProps) => (
  <fieldset className="mb-4 flex items-center gap-5">
    <label className="text-gray-600 w-24 text-right" htmlFor={label}>
      {label}
    </label>
    <input
      id={label}
      className="shadow px-3 py-2 inline-flex w-full flex-1 items-center justify-center rounded leading-none outline-none focus:ring-2 border border-gray-400 ring-offset-2 ring-sky-500 duration-150"
      {...register(label, { required, maxLength, pattern })}
    />
  </fieldset>
);

const ShortlinkModal = () => {
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

  const isVisible = useModalStore((state) => state.isVisible);
  const setIsVisible = useModalStore((state) => state.setIsVisible);
  const selectedShortlink = useModalStore((state) => state.selectedShortlink);
  const resetSelectedShortlink = useModalStore(
    (state) => state.resetSelectedShortlink
  );

  const defaultValues = {
    Title: selectedShortlink?.title ?? "",
    Subtitle: selectedShortlink?.subtitle ?? "",
    URL: selectedShortlink?.url ?? "",
  };

  const { register, handleSubmit, reset } = useForm<FormInputs>({
    defaultValues,
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const normalizedUrl = normalizeUrl(data.URL);

    await addMutation.mutateAsync({
      id: selectedShortlink?.id ?? uuidv4(),
      title: data.Title,
      subtitle: String(data.Subtitle),
      url: normalizedUrl,
    });

    onCloseModal();
  };

  const onCloseModal = () => {
    resetSelectedShortlink();
    setIsVisible(false);
  };

  useEffect(() => {
    reset(defaultValues);
  }, [selectedShortlink]);

  return (
    <Dialog.Root open={isVisible}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0 z-20" />
        <Dialog.Content
          className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-md translate-x-[-50%] translate-y-[-50%] rounded bg-white p-[25px] shadow-lg focus:outline-none z-20"
          onEscapeKeyDown={onCloseModal}
          onInteractOutside={onCloseModal}
        >
          <Dialog.Title className="m-0 font-medium text-lg">
            {selectedShortlink ? "Edit a link" : "Save a link"}
          </Dialog.Title>
          {!selectedShortlink && (
            <Dialog.Description className="mt-3 mb-5 leading-normal">
              Save a link for later. You know, to help you find it later on.
            </Dialog.Description>
          )}

          <form
            className="flex flex-col mt-6"
            onSubmit={handleSubmit(onSubmit)}
          >
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
                  className="bg-white hover:bg-gray-100 active:bg-gray-200 duration-150 ring-offset-2 active:ring-2 ring-sky-500 inline-flex items-center justify-center rounded px-4 py-3 font-medium leading-none focus:outline-none focus:ring-2"
                  onClick={async (event) => {
                    event.preventDefault();
                    if (!selectedShortlink?.id) {
                      return;
                    }

                    await deleteMutation.mutateAsync(selectedShortlink.id);
                    resetSelectedShortlink();

                    setIsVisible(false);
                  }}
                >
                  Delete
                </button>
              )}
              <button className="bg-sky-500 text-white hover:brightness-110 duration-150 ring-offset-2 active:ring-2 ring-sky-500 inline-flex items-center justify-center rounded px-4 py-3 font-medium leading-none focus:outline-none focus:ring-2 active:brightness-100">
                {selectedShortlink ? "Update link" : "Save link"}
              </button>
            </div>
          </form>

          <Dialog.Close asChild onClick={onCloseModal}>
            <button
              className="absolute top-2.5 right-2.5 inline-flex h-6 w-6 appearance-none items-center justify-center rounded-full focus:outline-none focus:ring-2 ring-offset-2 ring-sky-500 duration-150"
              aria-label="Close"
            >
              <XMarkIcon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ShortlinkModal;
