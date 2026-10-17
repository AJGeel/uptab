import { cn } from "@/src/utils";

type TabProps = {
  isActive: boolean;
  label: string;
  onClick: () => void;
};

const Tab = ({ isActive, label, onClick }: TabProps) => (
  <button
    className={cn(
      "grow rounded-lg px-3 py-2 text-center font-medium duration-150",
      isActive
        ? "bg-white text-black shadow-xs outline-1 outline-black/5 outline-solid"
        : "text-gray-500 active:bg-gray-200",
    )}
    onClick={onClick}
  >
    {label}
  </button>
);

export default Tab;
