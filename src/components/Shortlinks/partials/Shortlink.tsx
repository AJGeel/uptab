import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";

import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import { useShortlinkStore } from "@/src/hooks/stores/useShortlinkStore";
import { Shortlink } from "@/src/services/shortlinks";
import { getFavicon } from "@/src/utils/getFavicon";

import IconButton from "../../ui/IconButton";
import ImageWithFallback from "../../ui/ImageWithFallback";

type Props = {
  item: Shortlink;
};

const Shortlink = ({ item }: Props) => {
  const setActiveModal = useModalStore((state) => state.setActiveModal);
  const setSelectedShortlink = useShortlinkStore((state) => state.setSelected);

  return (
    <a
      href={item.url}
      className="flex cursor-pointer items-center gap-3 rounded border px-3 py-2.5 shadow ring-sky-500 duration-150 hover:ring focus:outline-none focus:ring"
    >
      <ImageWithFallback
        src={getFavicon(item.url)}
        fallbackSrc="/icon-34.png"
        className="h-6 w-6 shrink-0 rounded"
      />
      <div className="flex grow flex-col truncate">
        <h2 className="truncate text-sm font-semibold">{item.title}</h2>
        <p className="truncate text-sm text-gray-600">{item.subtitle}</p>
      </div>
      <IconButton
        className="border-none shadow-none"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();

          setSelectedShortlink(item);
          setActiveModal(Modals.shortlink);
        }}
      >
        <EllipsisHorizontalIcon className="h-5 w-5 text-gray-600" />
      </IconButton>
    </a>
  );
};

export default Shortlink;
