import { ComponentProps, ReactNode, useEffect, useState } from "react";

import { cn } from "@/src/utils";

interface ImageBackgroundFadeInProps extends ComponentProps<"img"> {
  src: string;
  alt: string;
  className?: string;
  children: ReactNode;
}

const ImageBackgroundFadeIn = ({
  className,
  children,
  ...props
}: ImageBackgroundFadeInProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.src = props.src;
    image.onload = () => {
      setIsLoaded(true);
    };
  }, [props.src]);

  return (
    <div
      style={{ backgroundImage: `url('${props.src}')` }}
      className={cn("duration-300", className, !isLoaded && "opacity-0 ")}
      {...props}
    >
      {children}
    </div>
  );
};

export default ImageBackgroundFadeIn;
