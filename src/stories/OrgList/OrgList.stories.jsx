import React from "react";

import { OrgList } from "./OrgList";

export default {
    title: "Organization List",
    component: OrgList,
  };
const Template = (args) => <OrgList {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
