import Button, { buttonVariants } from "../../ui/Button";

type Props = {
  message: string;
  onDismiss: () => void;
};

/** Something that went differently than asked, above the list. */
const Notice = ({ message, onDismiss }: Props) => (
  <div
    role="status"
    className="flex shrink-0 items-start gap-2 bg-amber-50 px-2 py-1.5 text-xs text-amber-950"
  >
    <p className="grow">{message}</p>
    <Button
      label="Dismiss"
      variant={buttonVariants.inline}
      onClick={onDismiss}
    />
  </div>
);

export default Notice;
