/**
 * A bucket of tokens that refills over time, so a few things can happen at once
 * and after that only at a steady pace. Ask for a token with the function it
 * returns: it says whether you got one.
 */
export const createRateLimit = (
  capacity: number,
  refillMs: number,
  now: () => number = () => performance.now(),
) => {
  let tokens = capacity;
  let lastTime = now();

  return () => {
    const time = now();

    tokens = Math.min(capacity, tokens + (time - lastTime) / refillMs);
    lastTime = time;

    if (tokens < 1) {
      return false;
    }

    tokens -= 1;

    return true;
  };
};
