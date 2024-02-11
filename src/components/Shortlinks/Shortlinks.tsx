import { useQuery } from "@tanstack/react-query";

import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import { useShortlinkStore } from "@/src/hooks/stores/useShortlinkStore";
import { useSettings } from "@/src/hooks/useSettings";
import { getShortlinks } from "@/src/services/shortlinks";

import EmptyState from "./partials/EmptyState";
import Shortlink from "./partials/Shortlink";

const Shortlinks = () => {
  const { data: settingsData } = useSettings();

  const setActiveModal = useModalStore((state) => state.setActiveModal);
  const setSelectedShortlink = useShortlinkStore((state) => state.setSelected);

  const { isPending, isError, data } = useQuery({
    queryFn: getShortlinks,
    queryKey: ["shortlinks"],
  });

  if (!settingsData?.sidebar.showShortlinks) {
    return <></>;
  }

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
          <div className="col-span-2 mt-4">
            <button
              className="inline cursor-pointer underline hover:text-black hover:no-underline"
              onClick={() => {
                setSelectedShortlink(null);
                setActiveModal(Modals.shortlink);
              }}
            >
              Add a link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shortlinks;
