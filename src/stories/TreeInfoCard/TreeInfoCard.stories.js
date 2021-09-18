import React from "react";

import { TreeInfoCard } from "./TreeInfoCard";

export default {
  title: "Trees Info Card",
  component: TreeInfoCard,
};

const Template = (args) => <TreeInfoCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
