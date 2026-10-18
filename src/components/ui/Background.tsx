import { AnimatePresence, motion, Variants } from "motion/react";
import {
  HTMLAttributes,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";

import { cn } from "@/src/utils";

interface ImageProps extends Omit<HTMLAttributes<HTMLDivElement>, "onError"> {
  /** Nothing is shown until there's a src. */
  src?: string;
  alt: string;
  /** Shown while the photo loads. */
  color?: string;
  onError?: () => void;
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
  color,
  onError,
  children,
  style,
  ...props
}: ImageProps) => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const nextIdRef = useRef(0);
  // Calls the latest onError without reloading the image when it changes.
  const handleError = useEffectEvent(() => onError?.());

  useEffect(() => {
    if (!src) {
      return;
    }

    let cancelled = false;

    const image = new Image();
    image.src = src;

    image.onerror = () => {
      if (!cancelled) {
        handleError();
      }
    };

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

      const id = nextIdRef.current++;

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
      style={{ backgroundColor: color, ...style }}
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
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </div>
  );
};
