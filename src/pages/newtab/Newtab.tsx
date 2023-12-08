import { useState } from "react";

import Sidebar from "@src/components/Sidebar/Sidebar";
import InfoWidget from "@src/components/InfoWidget";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cn } from "@src/utils";
import ShortlinkModal from "@src/components/Shortlinks/ShortlinkForm";
import useKeyPress from "@src/hooks/useKeyPress";
import HotkeysModal from "@src/components/Hotkeys/HotkeysModal";
import ImageFadeIn from "@src/components/ui/ImageFadeIn";
import { addEasterEggs } from "@src/services/addEasterEggs";
import { useRandomBackground } from "@src/hooks/useRandomBackground";

export default function Newtab() {
  const queryClient = new QueryClient();
  const [isExpanded, setIsExpanded] = useState(false);
  const { activeBg } = useRandomBackground();

  useKeyPress("\\", () => setIsExpanded(!isExpanded));
  addEasterEggs();

  return (
    <QueryClientProvider client={queryClient}>
      <ShortlinkModal />
      <HotkeysModal />
      <div className="relative flex items-stretch w-full max-h-screen overflow-hidden min-h-screen h-full">
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
          {activeBg.author && activeBg.link && (
            <p className="p-6 mt-auto self-end inline hover:opacity-100 duration-150 text-white drop-shadow-md opacity-25">
              Photo by{" "}
              <a className="underline active:text-black" href={activeBg.link}>
                {activeBg.author}
              </a>
              .
            </p>
          )}
        </ImageFadeIn>
      </div>
    </QueryClientProvider>
  );
}
