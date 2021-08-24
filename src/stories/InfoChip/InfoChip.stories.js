import React from "react";

import { InfoChip } from "./InfoChip";

export default {
  title: "Info Chips",
  component: InfoChip,
};

const Template = (args) => <InfoChip {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
