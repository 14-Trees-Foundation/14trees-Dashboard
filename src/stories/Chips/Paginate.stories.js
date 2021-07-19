import React from "react";
import ReactPaginate from "react-paginate";

import Paginate from "./Paginate";

export default {
  title: "Example/Paginate",
  component: Paginate,
};

const Template = (args) => <ReactPaginate {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  previousLabel: "Previous Chip",
  nextLabel: "Next Chip",
  containerClassName: "org",
};
