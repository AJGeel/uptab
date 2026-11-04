import { cn } from "@/src/utils";

import Spinner from "./Spinner";

type Props = {
  className?: string;
  label: string;
};

const Loader = ({ label, className }: Props) => (
  <div className={cn("flex items-center gap-2.5", className)}>
    <div aria-hidden>
      <Spinner className="size-4" />
    </div>
    <p role="status">{label}</p>
  </div>
);

export default Loader;
