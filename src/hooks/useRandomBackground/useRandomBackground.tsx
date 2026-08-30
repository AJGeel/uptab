import { dailyRandomNumber } from "@/src/utils/dailyRandomNumber";

import { backgrounds } from "./backgrounds";
import useKeyPress from "../useKeyPress";
import { usePersistedState } from "../usePersistedState";

export const useRandomBackground = () => {
  const randomIndex = dailyRandomNumber(0, backgrounds.length - 1);
  const [offset, randomOffset] = usePersistedState(
    "random-bg-offset",
    randomIndex,
  );

  useKeyPress("ArrowRight", () => {
    randomOffset((prevIndex) => (prevIndex + 1) % backgrounds.length);
  });

  useKeyPress("ArrowLeft", () => {
    randomOffset(
      (prevIndex) => (prevIndex - 1 + backgrounds.length) % backgrounds.length,
    );
  });

  return {
    activeBg: backgrounds[offset],
    setActiveIndex: randomOffset,
  };
};
