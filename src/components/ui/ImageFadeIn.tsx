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
    const image = new Image();
    image.src = props.src;
    image.onload = () => {
      setIsLoaded(true);
    };
  }, []);

  if (asBackground) {
    return (
      <div
        style={{ backgroundImage: `url('${props.src}')` }}
        className={cn("duration-300", className, !isLoaded && "opacity-0")}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <img
      className={cn("duration-300", className, !isLoaded && "opacity-0")}
      onLoad={() => setIsLoaded(true)}
      {...props}
    />
  );
};

export default ImageFadeIn;
