import { AnimatePresence, motion, Variants } from "motion/react";
import { HTMLAttributes, useEffect, useRef, useState } from "react";

import { cn } from "@/src/utils";

interface ImageProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  className?: string;
}

interface Layer {
  id: number;
  src: string;
}

const layerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const Background = ({
  className,
  src,
  alt,
  children,
  ...props
}: ImageProps) => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    let cancelled = false;

    const image = new Image();
    image.src = src;

    image.onload = async () => {
      if (cancelled) return;

      try {
        await image.decode();
      } catch {
        // Image may already be decoded.
      }

      if (cancelled) return;

      const id = nextId.current++;

      setLayers((layers) => [...layers, { id, src }]);
    };

    return () => {
      cancelled = true;
    };
  }, [src]);

  const removeLayer = (id: number) =>
    setLayers((layers) => layers.filter((layer) => layer.id !== id));

  const pruneOlderThan = (id: number) =>
    setLayers((layers) => layers.filter((layer) => layer.id >= id));

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <AnimatePresence initial={false}>
        {layers.map((layer) => (
          <motion.div
            key={layer.id}
            className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("${layer.src}")`,
            }}
            variants={layerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            onAnimationComplete={(definition) => {
              if (definition === "visible") {
                pruneOlderThan(layer.id);
              } else if (definition === "hidden") {
                removeLayer(layer.id);
              }
            }}
          />
        ))}
      </AnimatePresence>
      <div className="relative z-10">{children}</div>
    </div>
  );
};
