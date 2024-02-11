import { useCallback, useEffect } from "react";

const debugMode = false;
/* eslint-disable no-console */

const useKeyPress = (targetKey: string, callback: () => void) => {
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
