import React from "react";

import { Impact } from "./Impact";

export default {
  title: "Example/Impact",
  component: Impact,
};

const Template = (args) => <Impact {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
