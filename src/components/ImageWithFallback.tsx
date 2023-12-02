import { ComponentProps, useState } from "react";

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

  return (
    <img
      src={hasError ? fallbackSrc : src}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};

export default ImageWithFallback;
