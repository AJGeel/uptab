import { Effect } from "./types";
import { EggId } from "../eggs";

const effects: Record<EggId, () => Promise<Effect>> = {
  Sinterklaas: async () => (await import("./candy")).startCandy(),
  Christmas: async () => (await import("./snow")).startSnow(),
  "Oud & Nieuw": async () => (await import("./fireworks")).startFireworks(),
};

/**
 * Loaded when an egg plays, so the effects stay out of the way of every other
 * tab. Each effect can be stopped, and reacts where you click.
 */
export const startEffect = (egg: EggId): Promise<Effect> => effects[egg]();
