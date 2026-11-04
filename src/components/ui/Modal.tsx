import { Dialog } from "@base-ui/react/dialog";
import { XIcon } from "@phosphor-icons/react";
import {
  ComponentProps,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/src/utils";

import IconButton from "./IconButton";

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: ReactNode;
  /**
   * Artwork across the top, which shows the title itself: the title and
   * subtitle then stay in the page for screen readers only.
   */
  banner?: ReactNode;
  /** Buttons, kept in view below the scrolling contents. */
  footer?: ReactNode;
  /** Return true when Escape was used up by something inside, so the modal stays open. */
  onEscape?: () => boolean;
  /** What to focus when it opens, instead of the first field. */
  initialFocus?: ComponentProps<typeof Dialog.Popup>["initialFocus"];
  className?: string;
}>;

type ModalSnapshot = {
  title: string;
  subtitle?: ReactNode;
  banner?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
};

const useFreezeContentsOnClose = ({
  isVisible,
  title,
  subtitle,
  banner,
  footer,
  children,
}: Props) => {
  const snapshotRef = useRef<ModalSnapshot>({
    title,
    subtitle,
    banner,
    footer,
    children,
  });

  useLayoutEffect(() => {
    if (isVisible) {
      snapshotRef.current = {
        title,
        subtitle,
        banner,
        footer,
        children,
      };
    }
  }, [isVisible, title, subtitle, banner, footer, children]);

  const modalContents = isVisible
    ? { title, subtitle, banner, footer, children }
    : // Deliberately read during render: keeps the last contents on screen
      // while the close animation plays. State would re-render on every change.
      // eslint-disable-next-line react-hooks/refs
      snapshotRef.current;

  return modalContents;
};

/** Whether the element's contents are taller than the element itself. */
const useIsOverflowing = (element: HTMLElement | null) => {
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (!element) {
      return;
    }

    const update = () =>
      setIsOverflowing(element.scrollHeight > element.clientHeight);
    const observer = new ResizeObserver(update);

    // The element itself and its single wrapper, which grows with the contents.
    observer.observe(element);
    [...element.children].forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, [element]);

  return isOverflowing;
};

const Modal = ({
  className,
  onClose,
  isVisible,
  onEscape,
  initialFocus,
  ...modalProps
}: Props) => {
  const { title, subtitle, banner, footer, children } =
    useFreezeContentsOnClose({
      isVisible,
      onClose,
      ...modalProps,
    });
  const [body, setBody] = useState<HTMLDivElement | null>(null);
  const isOverflowing = useIsOverflowing(body);

  return (
    <Dialog.Root
      open={isVisible}
      onOpenChange={(open, eventDetails) => {
        if (open) {
          return;
        }

        if (eventDetails.reason === "escape-key" && onEscape?.()) {
          eventDetails.cancel();

          return;
        }

        onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop
          // Also when this modal sits on top of another, so the one below is dimmed too.
          forceRender
          className="
            fixed inset-0 z-20 bg-black/50
            data-closed:animate-overlayHide
            data-open:animate-overlayShow
          "
        />

        <Dialog.Popup
          initialFocus={initialFocus}
          className={cn(
            `
              fixed top-[50%] left-[50%] z-20
              flex max-h-[85vh] w-[90vw] max-w-md
              translate-[-50%] flex-col
              rounded-2xl bg-white/95
              shadow-lg
              backdrop-blur-lg backdrop-brightness-190
              backdrop-saturate-150 focus:outline-hidden
              data-closed:animate-contentHide data-open:animate-contentShow

              motion-reduce:data-closed:animate-overlayHide motion-reduce:data-open:animate-overlayShow
            `,
            className,
          )}
        >
          {/* The title and footer stay in view; only the part between scrolls. */}
          {banner && (
            <div aria-hidden className="shrink-0 overflow-hidden rounded-t-2xl">
              {banner}
            </div>
          )}

          <Dialog.Title
            className={cn(
              "m-0 shrink-0 px-6 pt-6 pr-16 text-lg font-bold",
              banner && "sr-only",
            )}
          >
            {title}
          </Dialog.Title>

          <div
            ref={setBody}
            className={cn(
              // Keeps room for the scrollbar, so contents growing past the edge don't get narrower.
              "min-h-0 flex-1 scrollbar-gutter-stable overflow-y-auto px-6 pb-6",
              banner && "pt-6",
              footer && isOverflowing && "border-b border-black/10",
            )}
          >
            <div>
              {subtitle && (
                <Dialog.Description
                  className={cn(
                    "mt-3 mb-6 leading-normal text-gray-800",
                    banner && "sr-only",
                  )}
                  style={{ textWrap: "pretty" }}
                >
                  {subtitle}
                </Dialog.Description>
              )}

              {children}
            </div>
          </div>

          {footer && (
            <div
              className={cn(
                "shrink-0 px-6 pb-6",
                isOverflowing ? "pt-4" : "pt-2",
              )}
            >
              {footer}
            </div>
          )}

          <Dialog.Close
            aria-label="Close"
            render={
              <IconButton
                className={cn(
                  "absolute top-5 right-5 z-20 bg-transparent hover:bg-white",
                  banner && "bg-white/70 backdrop-blur-sm",
                )}
                hideBorder
              />
            }
          >
            <XIcon className="size-5" />
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
