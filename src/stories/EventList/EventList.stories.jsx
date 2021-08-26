import React from "react";

import { EventList } from "./EventList";

export default {
    title: "Event List",
    component: EventList,
  };
const Template = (args) => <EventList {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
