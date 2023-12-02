import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { Shortlink } from "@src/services/shortlinks";
import IconButton from "../IconButton";
import useModalStore from "@src/hooks/useModalStore";
import ImageWithFallback from "../ImageWithFallback";
import { getFavicon } from "@src/utils/getFavicon";
import { useShortlinkStore } from "@src/hooks/useShortlinkStore";

type Props = {
  item: Shortlink;
};

const Shortlink = ({ item }: Props) => {
  const setIsModalVisible = useModalStore((state) => state.setIsVisible);
  const setSelectedShortlink = useShortlinkStore((state) => state.setSelected);

  return (
    <a
      href={item.url}
      className="flex gap-3 items-center px-3 py-2.5 rounded border shadow focus:ring focus:outline-none hover:ring ring-sky-500 duration-150 cursor-pointer"
    >
      <ImageWithFallback
        src={getFavicon(item.url)}
        fallbackSrc="/icon-34.png"
        className="flex-shrink-0 rounded w-6 h-6"
      />
      <div className="flex flex-col grow truncate">
        <h2 className="font-semibold truncate text-sm">{item.title}</h2>
        <p className="truncate text-gray-600 text-sm">{item.subtitle}</p>
      </div>
      <IconButton
        className="shadow-none border-none"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();

          setSelectedShortlink(item);
          setIsModalVisible(true);
        }}
      >
        <EllipsisHorizontalIcon className="w-5 h-5 text-gray-600" />
      </IconButton>
    </a>
  );
};

export default Shortlink;
