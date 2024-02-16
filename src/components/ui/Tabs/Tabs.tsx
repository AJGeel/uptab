import { ReactElement, useState } from "react";

import useKeyPress, { hotkeys } from "@/src/hooks/useKeyPress";

import Tab from "./partials/Tab";

type Props = {
  tabs: {
    label: string;
    content: ReactElement;
  }[];
};

const Tabs = ({ tabs }: Props) => {
  const [activeTab, setActiveTab] = useState(0);

  useKeyPress(hotkeys.left, () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  });

  useKeyPress(hotkeys.right, () => {
    if (activeTab < tabs.length) {
      setActiveTab(activeTab + 1);
    }
  });

  return (
    <>
      <div className="mb-4 flex items-center gap-1 rounded-md bg-gray-100 p-1.5">
        {tabs.map((item, index) => (
          <Tab
            key={index}
            label={item.label}
            isActive={index === activeTab}
            onClick={() => setActiveTab(index)}
          />
        ))}
      </div>
      {tabs[activeTab].content}
    </>
  );
};

export default Tabs;
