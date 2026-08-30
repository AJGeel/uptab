import { FieldError, Path, UseFormRegister } from "react-hook-form";

import { FormInputs } from "../ShortlinksModal";

type FormFieldProps = {
  label: Path<FormInputs>;
  register: UseFormRegister<FormInputs>;
  error?: FieldError;
  required?: boolean;
  maxLength?: number;
  pattern?: RegExp;
  autoFocus?: boolean;
};

const FormField = ({
  label,
  register,
  error,
  required,
  maxLength,
  pattern,
  autoFocus = false,
}: FormFieldProps) => {
  const errorMessage =
    error?.type === "required"
      ? `${label} is required`
      : error?.type === "pattern"
        ? `Please enter a valid ${label}`
        : error?.type === "maxLength"
          ? `${label} is too long`
          : error?.message;

  return (
    <fieldset className="mb-4 flex items-start gap-5">
      <label
        className="w-24 pt-2 text-right font-semibold capitalize text-gray-700"
        htmlFor={label}
      >
        {label}
      </label>
      <div className="flex w-full flex-1 flex-col gap-1">
        <input
          id={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${label}-error` : undefined}
          className={`inline-flex w-full items-center justify-center rounded-lg border px-3 py-2 leading-none shadow outline-none ring-sky-500 ring-offset-2 duration-150 focus:ring-2 ${error ? "border-red-400 focus:ring-red-400" : "border-gray-300"}`}
          autoFocus={autoFocus}
          {...register(label, { required, maxLength, pattern })}
        />
        {errorMessage && (
          <p
            id={`${label}-error`}
            className="text-xs text-red-500"
            role="alert"
          >
            {errorMessage}
          </p>
        )}
      </div>
    </fieldset>
  );
};

export default FormField;
