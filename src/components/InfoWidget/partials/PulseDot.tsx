/** A dot with a ring that keeps rippling outwards, for what's happening right now. */
const PulseDot = () => (
  <span aria-hidden className="relative flex size-2 shrink-0">
    <span className="absolute inline-flex size-full animate-ripple rounded-full bg-current motion-reduce:animate-none" />
    <span className="relative inline-flex size-2 rounded-full bg-current" />
  </span>
);

export default PulseDot;
