import { WarningCircleIcon } from "@phosphor-icons/react";

import {
  getFailureHelp,
  getFailureReason,
} from "@/src/services/location/locationMessages";
import { GpsFailure } from "@/src/services/location/types";

import Button, { buttonVariants } from "../../../ui/Button";

type Props = {
  failure: GpsFailure;
  onRetry: () => void;
};

const isFirefox = navigator.userAgent.includes("Firefox");

/** Why the current location isn't working, and what to try. */
const GpsHelp = ({ failure, onRetry }: Props) => (
  <div
    role="alert"
    className="space-y-2 rounded-xl bg-red-50 p-3 text-sm text-red-950"
  >
    <p className="flex items-center gap-2 font-semibold">
      <WarningCircleIcon
        weight="fill"
        className="size-5 shrink-0 text-red-600"
      />
      {getFailureReason(failure)}
    </p>

    <ul className="list-disc space-y-1 pl-9">
      {getFailureHelp(failure, isFirefox).map((step) => (
        <li key={step}>{step}</li>
      ))}
    </ul>

    <p className="pl-7">
      Then{" "}
      <Button
        label="try again"
        variant={buttonVariants.inline}
        onClick={onRetry}
      />
      , or pick a saved place below.
    </p>
  </div>
);

export default GpsHelp;
