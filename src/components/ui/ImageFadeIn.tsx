import { AnimatePresence, motion } from "motion/react";
import { HTMLAttributes, useEffect, useState } from "react";

import { cn } from "@/src/utils";

interface ImageProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  className?: string;
}

interface Layer {
  id: string;
  src: string;
}

export const ImageFadeIn = ({
  className,
  src,
  alt,
  children,
  ...props
}: ImageProps) => {
  const [layers, setLayers] = useState<Layer[]>([]);

  useEffect(() => {
    const image = new Image();
    image.src = src;

    image.onload = () => {
      setLayers((layers) => [
        ...layers,
        {
          id: crypto.randomUUID(),
          src,
        },
      ]);
    };

    return () => {
      image.onload = null;
    };
  }, [src]);

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </AnimatePresence>

      <div className="relative z-10">{children}</div>
    </div>
  );
};
