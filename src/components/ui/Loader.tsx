import { cn } from "@/src/utils";
import Spinner from "./Spinner";

type Props = {
  className?: string;
  label: string;
};

const Loader = ({ label, className }: Props) => (
  <div className={cn("flex items-center gap-2.5", className)}>
    <Spinner className="size-4" />
    <p>{label}</p>
  </div>
);

export default Loader;
