import { getShortlinks } from "@src/services/shortlinks";
import { useQuery } from "@tanstack/react-query";
import EmptyState from "./EmptyState";
import Shortlink from "./Shortlink";
import useModalStore from "@src/hooks/useModalStore";

const Shortlinks = () => {
  const setActiveModal = useModalStore((state) => state.setActiveModal);

  const { isPending, isError, data } = useQuery({
    queryKey: ["shortlinks"],
    queryFn: getShortlinks,
  });

  if (isPending) {
    return <p className="mt-10">Loading...</p>;
  }

  if (isError) {
    return <p>Unable to display your shortlinks.</p>;
  }

  return (
    <div className="mt-10">
      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {data.map((item) => (
            <Shortlink key={item.id} item={item} />
          ))}
          <span
            className="col-span-2 mt-4 inline cursor-pointer underline hover:text-black hover:no-underline"
            onClick={() => setActiveModal("SHORTLINK")}
          >
            Add a link
          </span>
        </div>
      )}
    </div>
  );
};

export default Shortlinks;
