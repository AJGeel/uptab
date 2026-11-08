import { IconWeight } from "@phosphor-icons/react";
import { useId } from "react";

type Props = {
  /** Outlined by default, solid for "fill". The other weights are drawn as outlined. */
  weight?: IconWeight;
  className?: string;
};

/** The UpTab logo, in the shape of a Phosphor icon so it sits among them. */
const UpTabIcon = ({ weight = "regular", className }: Props) => {
  const maskId = useId();

  const face = (
    <g
      fill="none"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5.4 10.4 7.6 8l2.2 2.4" />
      <path d="M14.2 10.4 16.4 8l2.2 2.4" />
      <path d="M9.4 14.2Q12 16.6 14.6 14.2" />
    </g>
  );

  if (weight === "fill") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={className}
        fill="currentColor"
      >
        <mask id={maskId}>
          <rect width="24" height="24" fill="white" />
          <g stroke="black">{face}</g>
        </mask>
        <rect
          x="1.5"
          y="1.5"
          width="21"
          height="21"
          rx="5.5"
          mask={`url(#${maskId})`}
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
    >
      <rect
        x="2.25"
        y="2.25"
        width="19.5"
        height="19.5"
        rx="5.25"
        strokeWidth="1.5"
      />
      <g stroke="currentColor">{face}</g>
    </svg>
  );
};

export default UpTabIcon;
