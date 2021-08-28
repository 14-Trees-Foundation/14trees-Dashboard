import React from "react";

import { PopupItem } from "./PopupItem";

export default {
    title: "Popup Item",
    component: PopupItem,
  };
const Template = (args) => <PopupItem {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
