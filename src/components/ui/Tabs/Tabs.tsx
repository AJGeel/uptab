import { ReactElement, useState } from "react";

import AnimatedHeight from "../AnimatedHeight";
import Tab from "./partials/Tab";

type TabItem<T> = {
  label: T;
  content: ReactElement;
};

type Props<T> = {
  tabs: TabItem<T>[];
  onTabChange?: (id: T) => void;
};

const Tabs = <T extends string>({ tabs, onTabChange }: Props<T>) => {
  const [activeTab, setActiveTab] = useState<T | undefined>(tabs[0]?.label);

  const handleTabChange = (id: T) => {
    setActiveTab(id);
    onTabChange?.(id);
  };

  const activeContent = tabs.find((tab) => tab.label === activeTab)?.content;

  return (
    <>
      <div className="mb-4 flex items-center gap-1 rounded-xl bg-black/5 p-1.5">
        {tabs.map((tab) => (
          <Tab
            key={tab.label}
            label={tab.label}
            isActive={tab.label === activeTab}
            onClick={() => handleTabChange(tab.label)}
          />
        ))}
      </div>
      {/* Side room, so the clipping wrapper doesn't cut off focus rings. */}
      <AnimatedHeight className="-mx-2 px-2">{activeContent}</AnimatedHeight>
    </>
  );
};

export default Tabs;
