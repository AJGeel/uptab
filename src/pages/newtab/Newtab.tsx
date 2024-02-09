import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import InfoWidget from "@/src/components/InfoWidget/InfoWidget";
import HotkeysModal from "@/src/components/Modals/HotkeysModal/HotkeysModal";
import ShortlinksModal from "@/src/components/Modals/ShortlinksModal/ShortlinksModal";
import Sidebar from "@/src/components/Sidebar/Sidebar";
import ImageFadeIn from "@/src/components/ui/ImageFadeIn";
import useKeyPress from "@/src/hooks/useKeyPress";
import { useRandomBackground } from "@/src/hooks/useRandomBackground";
import { addEasterEggs } from "@/src/services/addEasterEggs";
import { cn } from "@/src/utils";

const queryClient = new QueryClient();

export default function Newtab() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { activeBg } = useRandomBackground();

  useKeyPress("\\", () => setIsExpanded(!isExpanded));
  addEasterEggs();

  return (
    <QueryClientProvider client={queryClient}>
      <ShortlinksModal />
      <HotkeysModal />
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
          <p className="mt-auto inline self-end p-6 text-white opacity-75 drop-shadow-md duration-150 hover:opacity-100">
            Got feedback?{" "}
            <a
              className="underline"
              href="https://docs.google.com/forms/d/e/1FAIpQLSfvi2jV7AlzGamcSzMUlXT74HAisrrjUiKFZ4-rmQKeG41oHA/viewform?usp=sf_link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Drop it here
            </a>
            .
          </p>
        </ImageFadeIn>
      </div>
    </QueryClientProvider>
  );
}
