import React from "react";

import { InfoChip } from "./InfoChip";

export default {
  title: "Example/Button Chips",
  component: InfoChip,
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

const Template = (args) => <InfoChip {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: "Organization (20)",
};
