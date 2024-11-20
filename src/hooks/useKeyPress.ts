/* eslint-disable no-console */
import { useCallback, useEffect } from "react";

const debugMode = false;

export const hotkeys = {
  slash: "/",
  backslash: "\\",
  questionMark: "?",
  left: "ArrowLeft",
  right: "ArrowRight",
  greaterThan: ">",
} as const;

type Hotkeys = (typeof hotkeys)[keyof typeof hotkeys];

const useKeyPress = (targetKey: Hotkeys, callback: () => void) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (debugMode) {
        console.info(event);
      }

      if (event.key === targetKey) {
        callback();
      }
    },
    [targetKey, callback]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
};

export default useKeyPress;
