import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import {
  Modals as ModalIds,
  useModalStore,
} from "@/src/hooks/stores/useModalStore";
import { useEasterEggs } from "@/src/hooks/useEasterEggs";
import useKeyPress from "@/src/hooks/useKeyPress";
import { useRandomBackground } from "@/src/hooks/useRandomBackground/useRandomBackground";
import { useSettings } from "@/src/hooks/useSettings";
import { hotkeys } from "@/src/services/hotkeys/hotkeys";
import { cn } from "@/src/utils";

import InfoWidget from "../InfoWidget/InfoWidget";
import { ActiveHotkeyIndicator } from "../Modals/HotkeysModal/partials/ActiveHotkeyIndicator";
import Modals from "../Modals/Modals";
import BarButton from "./partials/BarButton";
import Sidebar from "../Sidebar/Sidebar";
import { Background } from "../ui/Background";

const Homescreen = () => {
  const { data: settings, isPending, toggleSidebarSetting } = useSettings();
  const { activeBg, onError, browse } = useRandomBackground();
  const setActiveModal = useModalStore((state) => state.setActiveModal);
  const showCredit = settings?.homescreen.showPhotoCredit && activeBg?.author;

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
          src={activeBg?.src}
          onError={onError}
          alt={
            activeBg?.author
              ? `A great photo by ${activeBg.author}`
              : "Background photo"
          }
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
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/50 to-transparent duration-500",
              isSidebarOpen && "opacity-0",
            )}
          />
          <div className="relative mt-auto self-start p-2">
            <div
              className={cn(
                "flex items-center gap-1 rounded-2xl p-1 text-white opacity-100 duration-500 text-shadow-black/20 text-shadow-md focus-within:bg-black/30 focus-within:opacity-100 hover:bg-black/30 hover:opacity-100",
                isSidebarOpen && "pointer-events-none translate-x-40 opacity-0",
              )}
            >
              <BarButton
                aria-label="Previous background"
                tooltip="Previous photo (←)"
                className="active:scale-90"
                onClick={() => browse(-1)}
              >
                <ChevronLeftIcon className="size-4 drop-shadow-md drop-shadow-black/20" />
              </BarButton>
              <BarButton
                tooltip="Choose themes (B)"
                className="flex items-center gap-2 px-3 text-shadow-black/20 text-shadow-md active:scale-95"
                onClick={() => setActiveModal(ModalIds.backgrounds)}
              >
                Backgrounds
              </BarButton>
              <BarButton
                aria-label="Next background"
                tooltip="Next photo (→)"
                className="active:scale-90"
                onClick={() => browse(1)}
              >
                <ChevronRightIcon className="size-4 drop-shadow-md drop-shadow-black/20" />
              </BarButton>
              {showCredit &&
                (activeBg.link ? (
                  <a
                    href={activeBg.link}
                    className="mr-1 ml-3 rounded-xl p-2 px-3 duration-150 text-shadow-black/20 text-shadow-md hover:bg-white/15 active:scale-95"
                  >
                    Photo by {activeBg.author}
                  </a>
                ) : (
                  <p className="mr-1 ml-3 p-2 px-3 text-shadow-black/20 text-shadow-md">
                    Photo by {activeBg.author}
                  </p>
                ))}
            </div>
          </div>
        </Background>
      </div>
    </>
  );
};

export default Homescreen;
