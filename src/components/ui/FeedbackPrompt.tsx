import { runtime } from "webextension-polyfill";

import { buildFeedbackUrl } from "@/src/services/feedback/feedbackUrl";
import { cn } from "@/src/utils";

import { inlineLinkStyles } from "./Button";

type Props = {
  className?: string;
};

const FeedbackPrompt = ({ className }: Props) => {
  const formUrl = buildFeedbackUrl(
    runtime.getManifest().version,
    navigator.userAgent,
  );

  return (
    <p
      data-setting="sidebar.showFeedbackPrompt"
      className={cn("text-black/70", className)}
    >
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
