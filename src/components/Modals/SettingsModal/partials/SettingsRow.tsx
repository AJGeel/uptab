import { ReactElement } from "react";

import { Switch } from "@/src/components/ui/Switch";
import { cn } from "@/src/utils";

type Props = {
  title: string;
  description: string;
  icon?: ReactElement;
  isActive: boolean;
  className?: string;
  onClick: () => void;
};

const SettingsRow = ({
  title,
  description,
  isActive,
  className,
  onClick,
}: Props) => (
  <div
    className={cn(
      "group flex cursor-pointer items-center justify-between gap-2 border-b py-3 last:border-b-0",
      className
    )}
    onClick={onClick}
  >
    <div className="group grow">
      <div className="flex flex-col duration-150 group-active:scale-95">
        <h2 className="font-bold duration-150 group-hover:text-sky-800">
          {title}
        </h2>
        <p className="text-sm text-gray-700 duration-150 group-hover:text-sky-800">
          {description}
        </p>
      </div>
    </div>
    <Switch checked={isActive} onCheckedChange={onClick} />
  </div>
);

export default SettingsRow;
