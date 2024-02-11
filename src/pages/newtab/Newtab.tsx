import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import InfoWidget from "@/src/components/InfoWidget/InfoWidget";
import Modals from "@/src/components/Modals/Modals";
import Sidebar from "@/src/components/Sidebar/Sidebar";
import FeedbackPrompt from "@/src/components/ui/FeedbackPrompt";
import ImageFadeIn from "@/src/components/ui/ImageFadeIn";
import { useEasterEggs } from "@/src/hooks/useEasterEggs";
import useKeyPress from "@/src/hooks/useKeyPress";
import { useRandomBackground } from "@/src/hooks/useRandomBackground";
import { cn } from "@/src/utils";

const queryClient = new QueryClient();

export default function Newtab() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { activeBg } = useRandomBackground();

  useKeyPress("\\", () => setIsExpanded(!isExpanded));
  useEasterEggs();

  return (
    <QueryClientProvider client={queryClient}>
      <Modals />
      <div className="relative flex h-full max-h-screen min-h-screen w-full items-stretch overflow-hidden">
        <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        <ImageFadeIn
          asBackground={true}
          src={activeBg.src}
          alt="A fancy background image"
          className={cn(
            "flex-1 bg-cover bg-center flex flex-col duration-500",
            isExpanded ? "scale-105" : ""
          )}
        >
          <InfoWidget
            className={cn(
              "p-6 pl-20 pb-16",
              isExpanded
                ? "opacity-0 translate-x-40 pointer-events-none"
                : "translate-x-0"
            )}
          />
          <FeedbackPrompt className="mt-auto inline self-end p-6" isDarkMode />
        </ImageFadeIn>
      </div>
    </QueryClientProvider>
  );
}
