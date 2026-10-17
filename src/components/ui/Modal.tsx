import { XMarkIcon } from "@heroicons/react/24/solid";
import * as Dialog from "@radix-ui/react-dialog";
import { PropsWithChildren, ReactNode, useLayoutEffect, useRef } from "react";

import { cn } from "@/src/utils";

import IconButton from "./IconButton";

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  className?: string;
}>;

type ModalSnapshot = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

const useFreezeContentsOnClose = ({
  isVisible,
  title,
  subtitle,
  children,
}: Props) => {
  const snapshotRef = useRef<ModalSnapshot>({
    title,
    subtitle,
    children,
  });

  useLayoutEffect(() => {
    if (isVisible) {
      snapshotRef.current = {
        title,
        subtitle,
        children,
      };
    }
  }, [isVisible, title, subtitle, children]);

  const modalContents = isVisible
    ? { title, subtitle, children }
    : // Deliberately read during render: keeps the last contents on screen
      // while the close animation plays. State would re-render on every change.
      // eslint-disable-next-line react-hooks/refs
      snapshotRef.current;

  return modalContents;
};

const Modal = ({ className, onClose, isVisible, ...modalProps }: Props) => {
  const { title, subtitle, children } = useFreezeContentsOnClose({
    isVisible,
    onClose,
    ...modalProps,
  });

  return (
    <Dialog.Root open={isVisible}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="
            fixed inset-0 z-20 bg-black/50
            data-[state=closed]:animate-overlayHide
            data-[state=open]:animate-overlayShow
          "
        />

        <Dialog.Content
          className={cn(
            `
              fixed top-[50%] left-[50%] z-20
              max-h-[85vh] w-[90vw] max-w-md
              translate-[-50%] overflow-y-auto
              rounded-2xl bg-white/95
              p-6 shadow-lg
              backdrop-blur-lg backdrop-brightness-190
              backdrop-saturate-150 focus:outline-hidden
              data-[state=closed]:animate-contentHide

              data-[state=open]:animate-contentShow
            `,
            className,
          )}
          onEscapeKeyDown={onClose}
          onInteractOutside={onClose}
        >
          <Dialog.Title className="m-0 text-lg font-bold">{title}</Dialog.Title>

          {subtitle && (
            <Dialog.Description
              className="mt-3 mb-6 leading-normal text-gray-800"
              style={{ textWrap: "pretty" }}
            >
              {subtitle}
            </Dialog.Description>
          )}

          {children}

          <Dialog.Close asChild onClick={onClose}>
            <IconButton
              aria-label="Close"
              className="absolute top-5 right-5 bg-transparent hover:bg-white"
              hideBorder
            >
              <XMarkIcon className="size-5" />
            </IconButton>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
