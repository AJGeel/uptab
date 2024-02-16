import { XMarkIcon } from "@heroicons/react/24/solid";
import * as Dialog from "@radix-ui/react-dialog";
import { ReactElement } from "react";

import { cn } from "@/src/utils";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  className?: string;
  children: ReactElement;
};

const Modal = ({
  isVisible,
  onClose,
  title,
  subtitle,
  className,
  children,
}: Props) => (
  <Dialog.Root open={isVisible}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-20 bg-black/50 data-[state=open]:animate-overlayShow" />
      <Dialog.Content
        className={cn(
          "data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-md translate-x-[-50%] translate-y-[-50%] rounded bg-white p-6 shadow-lg focus:outline-none z-20 overflow-y-auto",
          className
        )}
        onEscapeKeyDown={onClose}
        onInteractOutside={onClose}
      >
        <Dialog.Title className="m-0 text-lg font-bold">{title}</Dialog.Title>
        {subtitle && (
          <Dialog.Description
            className="mb-6 mt-3 leading-normal text-gray-800"
            style={{ textWrap: "balance" }}
          >
            {subtitle}
          </Dialog.Description>
        )}
        {children}
        <Dialog.Close asChild onClick={onClose}>
          <button
            className="absolute right-5 top-5 inline-flex appearance-none items-center justify-center rounded-full p-1 ring-sky-500 ring-offset-2 duration-150 hover:ring-2 focus:outline-none focus:ring-2"
            aria-label="Close"
          >
            <XMarkIcon className="size-5" />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default Modal;
