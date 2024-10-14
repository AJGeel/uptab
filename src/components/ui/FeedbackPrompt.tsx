import { cn } from "@/src/utils";

type Props = {
  className?: string;
};

const FeedbackPrompt = ({ className }: Props) => {
  const formUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSfvi2jV7AlzGamcSzMUlXT74HAisrrjUiKFZ4-rmQKeG41oHA/viewform?usp=sf_link";

  return (
    <p className={cn("text-black/70", className)}>
      Got feedback?{" "}
      <a
        className="underline hover:text-black hover:no-underline"
        href={formUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Drop it here
      </a>
      .
    </p>
  );
};

export default FeedbackPrompt;
