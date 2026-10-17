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
  // Tracks which src failed, so a new src gets a fresh try.
  const [failedSrc, setFailedSrc] = useState<string>();

  return (
    <img
      src={failedSrc === src ? fallbackSrc : src}
      onError={() => setFailedSrc(src)}
      {...props}
    />
  );
};

export default ImageWithFallback;
