import React from "react";
import { Tabs as AntdTabs } from "antd";

interface Tab {
  key: string;
  label: string;
  children: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultActiveKey?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, defaultActiveKey }) => {
  return <AntdTabs defaultActiveKey={defaultActiveKey} items={tabs} />;
};

export default Tabs;
