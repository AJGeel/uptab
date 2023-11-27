import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { Shortlink } from "@src/services/shortlinks";
import IconButton from "../IconButton";

type Props = {
  item: Shortlink;
};

const Shortlink = ({ item }: Props) => (
  <a
    href={item.url}
    className="flex gap-3 items-center px-3 py-2.5 rounded border shadow focus:ring focus:outline-none hover:ring ring-sky-500 duration-150 cursor-pointer"
  >
    <img className="flex-shrink-0 rounded w-6 h-6" src="/icon-34.png" />
    <div className="flex flex-col grow">
      <h2 className="font-semibold truncate text-sm">{item.title}</h2>
      <p className="truncate text-gray-600 text-sm">{item.subtitle}</p>
    </div>
    <IconButton
      className="shadow-none border-none"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        alert("todo");
      }}
    >
      <EllipsisHorizontalIcon className="w-5 h-5 text-gray-600" />
    </IconButton>
  </a>
);

export default Shortlink;
