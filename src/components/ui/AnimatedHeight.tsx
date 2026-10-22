import { motion, useReducedMotion } from "motion/react";
import { PropsWithChildren, useEffect, useState } from "react";

import { cn } from "@/src/utils";

type Props = PropsWithChildren<{
  /** E.g. horizontal room, so focus rings at the edges aren't clipped. */
  className?: string;
}>;

/**
 * Animates its height to follow its contents, so content that loads in
 * grows the space smoothly instead of jumping.
 */
const AnimatedHeight = ({ className, children }: Props) => {
  const [content, setContent] = useState<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number>();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!content) {
      return;
    }

    const observer = new ResizeObserver(([entry]) =>
      setHeight(entry.borderBoxSize[0].blockSize),
    );

    observer.observe(content);

    return () => observer.disconnect();
  }, [content]);

  return (
    <motion.div
      // The first measurement is set straight away; only later changes animate.
      initial={false}
      animate={height === undefined ? undefined : { height }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: "easeInOut",
      }}
      className={cn("overflow-hidden", className)}
    >
      {/* flow-root keeps the children's margins inside the measured height. */}
      <div ref={setContent} className="flow-root">
        {children}
      </div>
    </motion.div>
  );
};

export default AnimatedHeight;
