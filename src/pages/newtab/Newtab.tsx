import { useState } from "react";

import Sidebar from "@src/components/Sidebar/Sidebar";
import InfoWidget from "@src/components/InfoWidget";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cn } from "@src/utils";
import ShortlinkModal from "@src/components/Shortlinks/ShortlinkForm";
import useKeyPress from "@src/hooks/useKeyPress";
import HotkeysModal from "@src/components/Hotkeys/HotkeysModal";

export default function Newtab() {
  const queryClient = new QueryClient();
  const [isExpanded, setIsExpanded] = useState(false);

  const bgImgUrl = "/images/backgrounds/1.jpg";

  useKeyPress("\\", () => setIsExpanded(!isExpanded));

  return (
    <QueryClientProvider client={queryClient}>
      <ShortlinkModal />
      <HotkeysModal />
      <div className="relative flex items-stretch w-full max-h-screen overflow-hidden min-h-screen h-full bg-gray-100">
        <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        <div
          style={{
            backgroundImage: `url('${bgImgUrl}')`,
          }}
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
        </div>
      </div>
    </QueryClientProvider>
  );
}
