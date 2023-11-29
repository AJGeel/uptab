import { useState } from "react";

import Sidebar from "@src/components/Sidebar/Sidebar";
import InfoWidget from "@src/components/InfoWidget";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cn } from "@src/utils";
import IconButton from "@src/components/IconButton";
import { Cog8ToothIcon, LightBulbIcon } from "@heroicons/react/24/solid";
import ShortlinkModal from "@src/components/ShortlinkModal/ShortlinkModal";
import useKeyPress from "@src/hooks/useKeyPress";

const Menu = ({ isExpanded }: { isExpanded: boolean }) => (
  <div
    className={cn(
      "p-6 mt-auto flex justify-end gap-2 duration-300",
      isExpanded ? "" : "opacity-0 pointer-events-none"
    )}
  >
    <IconButton className="group" onClick={() => alert("To do: Show Menu")}>
      <Cog8ToothIcon className="w-4 h-4 group-hover:text-sky-500 duration-300" />
    </IconButton>
    <IconButton className="group" onClick={() => alert("To do: Show How To")}>
      <LightBulbIcon className="w-4 h-4 group-hover:text-sky-500 duration-300" />
    </IconButton>
  </div>
);

export default function Newtab() {
  const queryClient = new QueryClient();
  const [isExpanded, setIsExpanded] = useState(true);

  const bgImgUrl = "/images/backgrounds/1.jpg";

  useKeyPress("\\", () => setIsExpanded(!isExpanded));

  return (
    <QueryClientProvider client={queryClient}>
      <link rel="preload" href={bgImgUrl} as="image" />

      <ShortlinkModal />
      <div className="flex items-stretch w-full min-h-screen h-full bg-gray-100">
        <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        <div
          style={{ backgroundImage: `url('${bgImgUrl}')` }}
          className="flex-1 bg-cover bg-center duration-300 flex flex-col"
        >
          <InfoWidget
            className={cn("p-6 pl-20 pb-16", isExpanded ? "opacity-0" : "")}
          />
          <Menu isExpanded={isExpanded} />
        </div>
      </div>
    </QueryClientProvider>
  );
}
