import { ReactElement } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/Select";
import { Switch } from "@/src/components/ui/Switch";

type SwitchProps = {
  type: "Switch";
  isActive: boolean;
};

type DropdownProps = {
  type: "Dropdown";
  options: string[];
  selected: string;
};

type Props = {
  title: string;
  description: string;
  icon?: ReactElement;
  onClick: () => void;
} & (SwitchProps | DropdownProps);

const SettingsRow = ({
  title,
  description,
  type,
  onClick,
  options,
  selected,
  isActive,
}: Props) => (
  <div
    className="group flex cursor-pointer items-center justify-between gap-2 border-b py-3 last:border-b-0"
    onClick={onClick}
  >
    <div className="flex grow flex-col">
      <h2 className="font-bold duration-150 group-hover:text-sky-800">
        {title}
      </h2>
      <p className="text-sm text-gray-700 duration-150 group-hover:text-sky-800">
        {description}
      </p>
    </div>
    {type === "Switch" && (
      <Switch checked={isActive} onCheckedChange={onClick} />
    )}
    {type === "Dropdown" && (
      <Select>
        <SelectTrigger className="w-[180px] capitalize">
          <SelectValue placeholder="Huts" className="capitalize" />
        </SelectTrigger>
        <SelectContent>
          {options.map((item) => (
            <SelectItem
              key={item}
              value={item}
              className="cursor-pointer capitalize duration-150 hover:bg-sky-100"
            >
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )}
  </div>
);

export default SettingsRow;
