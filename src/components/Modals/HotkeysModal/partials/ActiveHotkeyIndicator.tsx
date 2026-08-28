import { useEffect, useState } from "react";

import { isEditableElement } from "@/src/hooks/useKeyPress";
import { hotkeyDescriptions, hotkeys } from "@/src/services/hotkeys/hotkeys";
import { Hotkeys } from "@/src/services/hotkeys/types";
import { cn } from "@/src/utils";

import { Hotkey } from "./HotkeyDescription";

export const ActiveHotkeyIndicator = () => {
  const [pressedKey, setPressedKey] = useState<Hotkeys | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableElement(event.target)) {
        return;
      }

      if (Object.values(hotkeys).includes(event.key as Hotkeys)) {
        setPressedKey(event.key as Hotkeys);
        setAnimationKey((key) => key + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!pressedKey) {
      return;
    }

    const timeout = setTimeout(() => {
      setPressedKey(null);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [pressedKey, animationKey]);

  return (
    <div
      key={animationKey}
      className={cn(
        "fixed bottom-6 right-6 z-10 animate-hotkey",
        !pressedKey && "pointer-events-none",
      )}
    >
      {pressedKey && (
        <Hotkey label={hotkeyDescriptions[pressedKey].keyDisplay} size="lg" />
      )}
    </div>
  );
};
