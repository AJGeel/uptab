import { ComponentProps, useEffect, useState } from "react";

interface ImageWithFallbackProps extends ComponentProps<"img"> {
  src: string;
  fallbackSrc: string;
}

const ImageWithFallback = ({
  src,
  fallbackSrc,
  ...props
}: ImageWithFallbackProps) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false)
  }, [src])

  return (
    <img
      src={hasError ? fallbackSrc : src}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};

export default ImageWithFallback;
