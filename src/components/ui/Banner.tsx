import { cn } from "@/src/utils";

import { Background } from "./Background";

type Props = {
  photoSrc?: string;
  title: string;
  subtitle?: string;
  className?: string;
};

const Banner = ({ photoSrc, title, subtitle, className }: Props) => (
  <Background
    src={photoSrc}
    alt=""
    className={cn(
      "flex h-40 flex-col bg-linear-to-b from-sky-500 to-sky-800",
      className,
    )}
  >
    <div className="absolute inset-0 bg-linear-to-t from-scrim/65 via-scrim/15 to-transparent" />

    <div className="absolute bottom-4 left-6 text-white text-shadow-md text-shadow-scrim/30">
      <p className="text-2xl leading-tight font-bold">{title}</p>
      {subtitle && <p className="mt-0.5 text-sm text-white/85">{subtitle}</p>}
    </div>
  </Background>
);

export default Banner;
