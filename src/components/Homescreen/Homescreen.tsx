import { useEasterEggs } from "@/src/hooks/useEasterEggs";
import useKeyPress, { hotkeys } from "@/src/hooks/useKeyPress";
import { useRandomBackground } from "@/src/hooks/useRandomBackground";
import { useSettings } from "@/src/hooks/useSettings";
import { cn } from "@/src/utils";

import InfoWidget from "../InfoWidget/InfoWidget";
import Modals from "../Modals/Modals";
import Sidebar from "../Sidebar/Sidebar";
import ImageBackgroundFadeIn from "../ui/ImageBackgroundFadeIn";

const Homescreen = () => {
  const { data: settings, isPending, toggleSidebarSetting } = useSettings();
  const { activeBg } = useRandomBackground();

  const isSidebarOpen = settings?.sidebar?.isOpen;

  useKeyPress(hotkeys.backslash, () => toggleSidebarSetting("isOpen"));
  useKeyPress(hotkeys.greaterThan, () =>
    window.open("/src/pages/history/index.html")
  );
  useEasterEggs();

  if (isPending) {
    return <></>;
  }

  return (
    <>
      <Modals />
      <div className="relative flex size-full max-h-screen min-h-screen items-stretch overflow-hidden">
        <Sidebar
          isExpanded={!!isSidebarOpen}
          setIsExpanded={() => toggleSidebarSetting("isOpen")}
        />

        <ImageBackgroundFadeIn
          src={activeBg.src}
          alt="A fancy background image"
          className={cn(
            "flex-1 bg-cover bg-center flex flex-col duration-500",
            isSidebarOpen ? "scale-105" : ""
          )}
        >
          {settings?.homescreen?.showInfoWidget && (
            <InfoWidget
              className={cn(
                "p-6 pl-20 pb-16",
                isSidebarOpen
                  ? "opacity-0 translate-x-40 pointer-events-none"
                  : "translate-x-0"
              )}
            />
          )}
        </ImageBackgroundFadeIn>
      </div>
    </>
  );
};

export default Homescreen;
