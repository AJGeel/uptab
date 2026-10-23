import { cn } from "@/src/utils";

import { inlineLinkStyles } from "./Button";

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
        className={cn("inline-block", inlineLinkStyles)}
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
