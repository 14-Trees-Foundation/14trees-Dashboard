import React from "react";

import { Bar } from "./Bar";

export default {
  title: "Progress Bar",
  component: Bar,
};
const Template = (args) => <Bar {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
