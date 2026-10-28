import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

import {
  Modals as ModalIds,
  useModalStore,
} from "@/src/hooks/stores/useModalStore";
import { useAccent } from "@/src/hooks/useAccent";
import { useEasterEggs } from "@/src/hooks/useEasterEggs";
import useKeyPress from "@/src/hooks/useKeyPress";
import { useRandomBackground } from "@/src/hooks/useRandomBackground/useRandomBackground";
import { useSettings } from "@/src/hooks/useSettings";
import { hotkeys } from "@/src/services/hotkeys/hotkeys";
import { cn } from "@/src/utils";

import InfoWidget from "../InfoWidget/InfoWidget";
import BarButton from "./partials/BarButton";
import { ActiveHotkeyIndicator } from "../Modals/HotkeysModal/partials/ActiveHotkeyIndicator";
import Modals from "../Modals/Modals";
import Sidebar from "../Sidebar/Sidebar";
import { Background } from "../ui/Background";
import UpdateNotification from "../UpdateNotification/UpdateNotification";

const Homescreen = () => {
  const { data: settings, isPending, toggleSidebarSetting } = useSettings();
  const { activeBg, onError, browse } = useRandomBackground();
  const setActiveModal = useModalStore((state) => state.setActiveModal);
  const openSettingsSection = useModalStore(
    (state) => state.openSettingsSection,
  );
  const showCredit = settings?.homescreen.showPhotoCredit && activeBg?.author;

  const isSidebarOpen = settings?.sidebar?.isOpen;

  useKeyPress(hotkeys.backslash, () => toggleSidebarSetting("isOpen"));
  useKeyPress("ArrowRight", () => browse(1));
  useKeyPress("ArrowLeft", () => browse(-1));
  useEasterEggs();
  useAccent();

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
              settingId="homescreen.showInfoWidget"
              inert={isSidebarOpen}
              className={cn(
                "p-6 pb-16 pl-20 duration-500",
                isSidebarOpen && "pointer-events-none translate-x-40 opacity-0",
              )}
            />
          )}
          {settings?.sidebar.showUpdates && (
            <div
              inert={isSidebarOpen}
              className={cn(
                "absolute top-6 right-6 w-max max-w-md duration-500",
                isSidebarOpen && "pointer-events-none translate-x-40 opacity-0",
              )}
            >
              <UpdateNotification variant="floating" />
            </div>
          )}
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/50 to-transparent duration-500",
              isSidebarOpen && "opacity-0",
            )}
          />
          <div className="relative mt-auto self-start p-2">
            <div
              inert={isSidebarOpen}
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
                <CaretLeftIcon className="size-4 drop-shadow-md drop-shadow-black/20" />
              </BarButton>
              <BarButton
                data-setting="photos.themes photos.photoChange"
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
                <CaretRightIcon className="size-4 drop-shadow-md drop-shadow-black/20" />
              </BarButton>
              {showCredit &&
                (activeBg.link ? (
                  <a
                    href={activeBg.link}
                    data-setting="homescreen.showPhotoCredit"
                    className="mr-1 ml-3 rounded-xl p-2 px-3 duration-150 text-shadow-black/20 text-shadow-md hover:bg-white/15 active:scale-95"
                  >
                    Photo by {activeBg.author}
                  </a>
                ) : (
                  <p
                    data-setting="homescreen.showPhotoCredit"
                    className="mr-1 ml-3 p-2 px-3 text-shadow-black/20 text-shadow-md"
                  >
                    Photo by {activeBg.author}
                  </p>
                ))}
            </div>
          </div>
          {settings?.homescreen.showPreferencesButton && (
            <div className="absolute right-0 bottom-0 p-2">
              <div
                inert={isSidebarOpen}
                data-setting="homescreen.showPreferencesButton"
                className={cn(
                  "rounded-2xl p-1 text-white duration-500 text-shadow-black/20 text-shadow-md focus-within:bg-black/30 hover:bg-black/30",
                  isSidebarOpen &&
                    "pointer-events-none translate-x-40 opacity-0",
                )}
              >
                <BarButton
                  tooltip="Edit preferences (/)"
                  className="flex items-center gap-2 px-3 text-shadow-black/20 text-shadow-md active:scale-95"
                  onClick={() => openSettingsSection("homescreen")}
                >
                  Edit preferences
                </BarButton>
              </div>
            </div>
          )}
        </Background>
      </div>
    </>
  );
};

export default Homescreen;
