import { cn } from "@/src/utils";

type TabProps = {
  isActive: boolean;
  label: string;
  onClick: () => void;
};

const Tab = ({ isActive, label, onClick }: TabProps) => (
  <button
    className={cn(
      "px-3 py-2 rounded-sm grow text-center duration-150 font-medium",
      isActive
        ? "bg-white text-black shadow-sm outline outline-black/5"
        : "text-gray-500 active:bg-gray-200"
    )}
    onClick={onClick}
  >
    {label}
  </button>
);

export default Tab;
