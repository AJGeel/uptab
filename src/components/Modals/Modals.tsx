import BackgroundsModal from "./BackgroundsModal/BackgroundsModal";
import HotkeysModal from "./HotkeysModal/HotkeysModal";
import SettingsModal from "./SettingsModal/SettingsModal";
import ShortlinksModal from "./ShortlinksModal/ShortlinksModal";
import WeatherForecastModal from "./WeatherForecastModal/WeatherForecastModal";

const Modals = () => (
  <>
    <ShortlinksModal />
    <HotkeysModal />
    <SettingsModal />
    <WeatherForecastModal />
    <BackgroundsModal />
  </>
);

export default Modals;
