const EmptyState = () => (
  <>
    <p className="text-sm text-black/70">*Crickets*</p>
    <p className="mt-2 text-sm text-black/70">
      No links found. Why don&apos;t you{" "}
      <span
        className="underline hover:no-underline hover:text-black cursor-pointer"
        onClick={() => {
          alert("Whoops. Dit bestaat nog niet.");
        }}
      >
        add one
      </span>
      ?
    </p>
  </>
);

export default EmptyState;
