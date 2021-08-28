import React from "react";

import { Popup } from "./Popup";

export default {
    title: "Popup modal",
    component: Popup,
  };
const Template = (args) => <Popup {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
