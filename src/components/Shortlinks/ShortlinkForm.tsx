import { useEffect } from "react";
import useModalStore from "@src/hooks/useModalStore";
import { Path, SubmitHandler, UseFormRegister, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { addShortlink, deleteShortlink } from "@src/services/shortlinks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { normalizeUrl } from "@src/utils/normalizeUrl";
import Modal from "../ui/Modal";
import { useShortlinkStore } from "@src/hooks/useShortlinkStore";

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

  const activeModal = useModalStore((state) => state.activeModal);
  const setActiveModal = useModalStore((state) => state.setActiveModal);
  const selectedShortlink = useShortlinkStore((state) => state.selected);
  const setSelectedShortlink = useShortlinkStore((state) => state.setSelected);

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
    setSelectedShortlink(null);
    setActiveModal(null);
  };

  useEffect(() => {
    reset(defaultValues);
  }, [selectedShortlink]);

  return (
    <Modal
      isVisible={activeModal === "SHORTLINK"}
      title={selectedShortlink ? "Edit a link" : "Save a link"}
      subtitle={
        selectedShortlink
          ? undefined
          : "Save a link for later. You know, so you might be able to actually find it when you need it."
      }
      onClose={onCloseModal}
    >
      <form className="flex flex-col mt-6" onSubmit={handleSubmit(onSubmit)}>
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
                onCloseModal();
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
    </Modal>
  );
};

export default ShortlinkModal;
