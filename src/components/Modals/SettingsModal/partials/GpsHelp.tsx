import { WarningIcon } from "@phosphor-icons/react";

import {
  getFailureHelp,
  getFailureReason,
} from "@/src/services/location/locationMessages";
import { GpsFailure } from "@/src/services/location/types";

import Button, { buttonVariants } from "../../../ui/Button";
import Loader from "../../../ui/Loader";

type Props = {
  failure: GpsFailure;
  isRetrying: boolean;
  onRetry: () => void;
};

const isFirefox = navigator.userAgent.includes("Firefox");

/** Why the current location isn't working, and what to try. */
const GpsHelp = ({ failure, isRetrying, onRetry }: Props) => {
  return (
    <div
      role="status"
      className="space-y-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-950"
    >
      <p className="flex items-center gap-2 font-semibold">
        <WarningIcon weight="fill" className="size-5 shrink-0 text-amber-500" />
        We couldn&apos;t detect your location automatically.
      </p>

      <p className="pl-7">{getFailureReason(failure)} To fix this:</p>

      <ul className="list-disc space-y-1 pl-12">
        {getFailureHelp(failure, isFirefox).map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>

      {isRetrying ? (
        <Loader label="Trying again..." className="pl-7" />
      ) : (
        <p className="pl-7">
          Then{" "}
          <Button
            label="try again"
            variant={buttonVariants.inline}
            onClick={onRetry}
          />
          . Or skip this and add a city yourself below.
        </p>
      )}
    </div>
  );
};

export default GpsHelp;
