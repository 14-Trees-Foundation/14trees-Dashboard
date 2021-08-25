import React from "react";

import { UserList } from "./UserList";

export default {
    title: "User List",
    component: UserList,
  };
const Template = (args) => <UserList {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
