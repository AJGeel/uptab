import Spinner from "../../ui/Spinner";

const LoadingState = () => (
  <div className="flex h-10 items-center gap-2.5">
    <Spinner className="size-4" />
    <p>Checking the weather...</p>
  </div>
);

export default LoadingState;
