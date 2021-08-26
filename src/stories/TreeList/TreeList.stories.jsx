import React from "react";

import { TreeList } from "./TreeList";

export default {
    title: "Tree List",
    component: TreeList,
  };
const Template = (args) => <TreeList {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
