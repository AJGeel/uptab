import { useEasterEggs } from "@/src/hooks/useEasterEggs";
import useKeyPress from "@/src/hooks/useKeyPress";
import { useRandomBackground } from "@/src/hooks/useRandomBackground/useRandomBackground";
import { useSettings } from "@/src/hooks/useSettings";
import { hotkeys } from "@/src/services/hotkeys/hotkeys";
import { cn } from "@/src/utils";

import InfoWidget from "../InfoWidget/InfoWidget";
import { ActiveHotkeyIndicator } from "../Modals/HotkeysModal/partials/ActiveHotkeyIndicator";
import Modals from "../Modals/Modals";
import Sidebar from "../Sidebar/Sidebar";
import { Background } from "../ui/Background";

const Homescreen = () => {
  const { data: settings, isPending, toggleSidebarSetting } = useSettings();
  const { activeBg } = useRandomBackground();

  const isSidebarOpen = settings?.sidebar?.isOpen;

  useKeyPress(hotkeys.backslash, () => toggleSidebarSetting("isOpen"));
  useEasterEggs();

  if (isPending) {
    return <></>;
  }

  return (
    <>
      <Modals />
      <ActiveHotkeyIndicator />
      <div className="relative flex size-full max-h-screen min-h-screen items-stretch overflow-hidden">
        <Sidebar
          isExpanded={!!isSidebarOpen}
          setIsExpanded={() => toggleSidebarSetting("isOpen")}
        />
        <Background
          src={activeBg.src}
          alt={`A great photo by ${activeBg.author}`}
          className={cn(
            "flex-1 bg-cover bg-center flex flex-col duration-500",
            isSidebarOpen && "scale-105",
          )}
        >
          {settings?.homescreen?.showInfoWidget && (
            <InfoWidget
              className={cn(
                "p-6 pl-20 pb-16",
                isSidebarOpen && "opacity-0 translate-x-40 pointer-events-none",
              )}
            />
          )}
          {settings?.homescreen.showPhotoCredit && (
            <div className="mt-auto self-start p-2">
              <p
                className={cn(
                  "inline-block self-start opacity-50 hover:opacity-100 p-2 px-4 duration-500 hover:bg-white rounded-2xl",
                  isSidebarOpen &&
                    "opacity-0 translate-x-40 pointer-events-none",
                )}
              >
                Photo by {activeBg.author}
              </p>
            </div>
          )}
        </Background>
      </div>
    </>
  );
};

export default Homescreen;
