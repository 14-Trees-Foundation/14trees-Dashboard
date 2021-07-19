import React from "react";

import { Chip } from "./Chip";

export default {
  title: "Example/Button Chips",
  component: Chip,
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

const Template = (args) => <Chip {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: "Button",
};
