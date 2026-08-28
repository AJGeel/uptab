/* eslint-disable no-console */
import { useCallback, useEffect } from "react";

import { Hotkeys } from "../services/hotkeys/types";

const DEBUG_ENABLED = false;

export const isEditableElement = (element: EventTarget | null): boolean => {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement ||
    element.isContentEditable
  );
};

const useKeyPress = (targetKey: Hotkeys, callback: () => void) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (DEBUG_ENABLED) {
        console.info(event);
      }

      if (isEditableElement(event.target)) {
        return
      }

      if (event.key === targetKey) {
        callback();
      }
    },
    [targetKey, callback],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
};

export default useKeyPress;
