import React from "react";

import { TreesPlanted } from "./TreesPlanted";

export default {
  title: "Trees Planted",
  component: TreesPlanted,
};

const Template = (args) => <TreesPlanted {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
