type Props = {
  /** The photo behind the app right now, if one has loaded. */
  photoSrc?: string;
  title: string;
  /** Under the title, e.g. the release date. */
  subtitle?: string;
};

/** The current background photo, with the release title across it. */
const Banner = ({ photoSrc, title, subtitle }: Props) => (
  <div
    className="relative h-40 bg-linear-to-b from-sky-500 to-sky-800 bg-cover bg-center"
    style={{ backgroundImage: photoSrc ? `url("${photoSrc}")` : undefined }}
  >
    {/* Keeps the title readable on any photo. */}
    <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/15 to-transparent" />

    <div className="absolute bottom-4 left-6 text-white text-shadow-black/30 text-shadow-md">
      <p className="text-2xl leading-tight font-bold">{title}</p>
      {subtitle && <p className="mt-0.5 text-sm text-white/85">{subtitle}</p>}
    </div>
  </div>
);

export default Banner;
