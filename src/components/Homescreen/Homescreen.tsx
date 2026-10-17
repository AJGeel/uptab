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
            "flex flex-1 flex-col bg-cover bg-center duration-500",
            isSidebarOpen && "scale-105",
          )}
        >
          {settings?.homescreen?.showInfoWidget && (
            <InfoWidget
              className={cn(
                "p-6 pb-16 pl-20 duration-500",
                isSidebarOpen && "pointer-events-none translate-x-40 opacity-0",
              )}
            />
          )}
          {settings?.homescreen.showPhotoCredit && (
            <div className="mt-auto self-start p-2">
              <p
                className={cn(
                  "inline-block self-start rounded-2xl p-2 px-4 opacity-50 duration-500 hover:bg-white hover:opacity-100",
                  isSidebarOpen &&
                    "pointer-events-none translate-x-40 opacity-0",
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
