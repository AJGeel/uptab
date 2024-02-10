import { Path, UseFormRegister } from "react-hook-form";

import { FormInputs } from "../ShortlinksModal";

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
    <label className="w-24 text-right text-gray-600" htmlFor={label}>
      {label}
    </label>
    <input
      id={label}
      className="inline-flex w-full flex-1 items-center justify-center rounded border border-gray-400 px-3 py-2 leading-none shadow outline-none ring-sky-500 ring-offset-2 duration-150 focus:ring-2"
      {...register(label, { maxLength, pattern, required })}
    />
  </fieldset>
);

export default FormField;
