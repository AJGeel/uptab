import { Effect } from "./types";
import { EggId } from "../eggs";

/**
 * Loaded when an egg plays, so the particle library stays out of the way of
 * every other tab. Each effect can be stopped, and bursts where you click.
 */
export const startEffect = async (egg: EggId): Promise<Effect> => {
  if (egg === "christmas") {
    return (await import("./snow")).startSnow();
  }

  return (await import("./candy")).startCandy();
};
