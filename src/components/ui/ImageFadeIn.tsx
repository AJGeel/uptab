import { AnimatePresence, motion } from "motion/react";
import { HTMLAttributes, useEffect, useState } from "react";

import { cn } from "@/src/utils";

interface ImageProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  className?: string;
}

type Layer = Pick<ImageProps, "src">;

export const ImageFadeIn = ({
  className,
  src,
  alt,
  children,
  ...props
}: ImageProps) => {
  const [layers, setLayers] = useState<Layer[]>([]);

  useEffect(() => {
    let cancelled = false;

    const image = new Image();
    image.src = src;

    image.onload = async () => {
      if (cancelled) {
        return;
      }

      try {
        await image.decode();
      } catch {
        // Image may already be decoded.
      }

      if (cancelled) {
        return;
      }

      setLayers((layers) => [
        ...layers,
        {
          src,
        },
      ]);
    };

    return () => {
      cancelled = true;
    };
  }, [src]);

  const removeLayer = (src: string) =>
    setLayers((layers) => layers.filter((layer) => layer.src !== src));

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
            key={layer.src}
            className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("${layer.src}")`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            onAnimationComplete={(definition) => {
              if (definition === "exit") {
                removeLayer(layer.src);
              }
            }}
          />
        ))}
      </AnimatePresence>
      <div className="relative z-10">{children}</div>
    </div>
  );
};
