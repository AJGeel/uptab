import { cn } from "@src/utils";
import { ComponentProps, useEffect, useState } from "react";

interface ImageProps extends ComponentProps<"img"> {
  src: string;
  alt: string;
  className?: string;
  asBackground?: boolean;
}

const ImageFadeIn = ({
  className,
  children,
  asBackground = false,
  ...props
}: ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!asBackground) {
      return;
    }

    const image = new Image();
    image.src = props.src;
    image.onload = () => {
      setIsLoaded(true);
    };
  }, []);

  const classes = cn("duration-300", className, !isLoaded && "opacity-0 ");

  if (asBackground) {
    return (
      <div
        style={{ backgroundImage: `url('${props.src}')` }}
        className={classes}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <img className={classes} onLoad={() => setIsLoaded(true)} {...props} />
  );
};

export default ImageFadeIn;
