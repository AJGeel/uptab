import { XMarkIcon } from "@heroicons/react/24/solid";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@src/utils";
import { ReactElement } from "react";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  className?: string;
  children: ReactElement;
};

const Modal = ({ isVisible, onClose, title, subtitle, children }: Props) => {
  return (
    <Dialog.Root open={isVisible}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0 z-20" />
        <Dialog.Content
          className={cn(
            "data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-md translate-x-[-50%] translate-y-[-50%] rounded bg-white p-6 shadow-lg focus:outline-none z-20"
          )}
          onEscapeKeyDown={onClose}
          onInteractOutside={onClose}
        >
          <Dialog.Title className="m-0 font-bold text-lg">{title}</Dialog.Title>
          {subtitle && (
            <Dialog.Description
              className="mt-3 mb-6 leading-normal text-gray-800"
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore  (until `textWrap: "balance'` becomes part of Tailwind / DOM spec 😪)
              style={{ textWrap: "balance" }}
            >
              {subtitle}
            </Dialog.Description>
          )}
          {children}
          <Dialog.Close asChild onClick={onClose}>
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

export default Modal;
