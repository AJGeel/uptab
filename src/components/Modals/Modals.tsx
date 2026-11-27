import BackgroundsModal from "./BackgroundsModal/BackgroundsModal";
import CalendarConnectModal from "./CalendarConnectModal/CalendarConnectModal";
import EasterEggModal from "./EasterEggModal/EasterEggModal";
import HotkeysModal from "./HotkeysModal/HotkeysModal";
import LocalPhotosModal from "./LocalPhotosModal/LocalPhotosModal";
import SettingsModal from "./SettingsModal/SettingsModal";
import ShortlinksModal from "./ShortlinksModal/ShortlinksModal";
import WeatherForecastModal from "./WeatherForecastModal/WeatherForecastModal";
import WhatsNewModal from "./WhatsNewModal/WhatsNewModal";

const Modals = () => (
  <>
    <ShortlinksModal />
    <HotkeysModal />
    <SettingsModal />
    <WeatherForecastModal />
    <BackgroundsModal />
    <LocalPhotosModal />
    <WhatsNewModal />
    <CalendarConnectModal />
    <EasterEggModal />
  </>
);

export default Modals;
