import React from "react";
import { Story } from "./Story";

export default {
  title: "Example/Story",
  component: Story,
};

const Template = (args) => <Story {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
