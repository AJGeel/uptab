import { cn } from "@/src/utils";

type Props = {
  className?: string;
  isDarkMode?: boolean;
};

const FeedbackPrompt = ({ className, isDarkMode = false }: Props) => {
  const formUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSfvi2jV7AlzGamcSzMUlXT74HAisrrjUiKFZ4-rmQKeG41oHA/viewform?usp=sf_link";

  return (
    <p
      className={cn(
        isDarkMode ? "text-white/70 drop-shadow-md" : "text-black/70",
        className
      )}
    >
      Got feedback?{" "}
      <a
        className={cn(
          "underline hover:no-underline",
          isDarkMode ? "hover:text-white" : "hover:text-black"
        )}
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
