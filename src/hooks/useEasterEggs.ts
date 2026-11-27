import { useEffect, useState } from "react";

import { useEggStore } from "./stores/useEggStore";
import { useSettings } from "./useSettings";
import { startEffect } from "../services/easterEggs/effects";
import { Effect } from "../services/easterEggs/effects/types";
import { eggs, pickEgg } from "../services/easterEggs/eggs";

const INTERACTIVE_ELEMENTS =
  "a, button, input, textarea, select, label, summary, [role]:not([role=img])";

/**
 * Rolls once per tab for a holiday egg, and sets the title for it. Nothing
 * happens for people who don't like fun. Returns the egg, if there is one.
 */
export const useEasterEggs = () => {
  const { data: settings } = useSettings();
  const forced = useEggStore((state) => state.forced);
  // Rolled once, so settings changing later doesn't re-roll the dice.
  const [rolled] = useState(() => {
    const roll = Math.random();

    return {
      egg: pickEgg(new Date(), roll),
      isCheeky: roll >= 0.95,
    };
  });

  const isOn = settings && !settings.appearance.disableFun;
  const egg = forced ? forced.egg : isOn ? rolled.egg : undefined;

  useEffect(() => {
    if (!isOn && !forced) {
      return;
    }

    if (egg) {
      document.title = eggs[egg].title;
    } else if (rolled.isCheeky) {
      document.title = "What's UpTab? 🥕";
    }
  }, [isOn, forced, egg, rolled.isCheeky]);

  // The particles of the egg, for as long as it plays.
  useEffect(() => {
    if (!egg) {
      return;
    }

    let effect: Effect | undefined;
    let isCancelled = false;

    // Clicks on the background, but not on anything that does something.
    const burstOnClick = (event: MouseEvent) => {
      const { target } = event;

      if (target instanceof Element && !target.closest(INTERACTIVE_ELEMENTS)) {
        effect?.burst(event.clientX, event.clientY);
      }
    };

    void startEffect(egg).then((started) => {
      if (isCancelled) {
        started.stop();
      } else {
        effect = started;
        document.addEventListener("click", burstOnClick);
      }
    });

    return () => {
      isCancelled = true;
      document.removeEventListener("click", burstOnClick);
      effect?.stop();
    };
  }, [egg]);

  return egg;
};
