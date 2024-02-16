import { Switch } from "@/src/components/ui/Switch";

type Props = {
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
};

const SettingsRow = ({ title, description, isActive, onClick }: Props) => (
  <div
    className="group flex cursor-pointer items-center justify-between gap-2 border-b py-3 last:border-b-0"
    onClick={onClick}
  >
    <div className="flex flex-col">
      <h2 className="font-bold duration-150 group-hover:text-sky-800">
        {title}
      </h2>
      <p className="text-sm text-gray-700 duration-150 group-hover:text-sky-800">
        {description}
      </p>
    </div>
    <Switch checked={isActive} onCheckedChange={onClick} />
  </div>
);

export default SettingsRow;
