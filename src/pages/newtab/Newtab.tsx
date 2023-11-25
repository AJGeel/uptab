import { useState } from "react";
import cn from "@src/utils/cn";
import Sidebar from "@src/components/Sidebar";
import InfoWidget from "@src/components/InfoWidget/InfoWidget";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Newtab() {
  const queryClient = new QueryClient();

  const [isExpanded, setIsExpanded] = useState(true);
  const bgImgUrl = "/images/backgrounds/1.jpg";

  return (
    <QueryClientProvider client={queryClient}>
      <link rel="preload" href={bgImgUrl} as="image" />

      <div className="flex items-stretch w-full min-h-screen h-full bg-gray-100">
        <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        <div
          style={{ backgroundImage: `url('${bgImgUrl}')` }}
          className="flex-1 bg-cover bg-center duration-300"
        >
          <InfoWidget
            className={cn(
              "bg-gradient-to-b w-full from-black/0 to-black/0 p-6 pl-20 pb-16",
              isExpanded ? "opacity-0" : ""
            )}
          />
        </div>
      </div>
    </QueryClientProvider>
  );
}
