import React from "react";
import "./Paginate.scss";
import ReactPaginate from "react-paginate";

export const Paginate = ({
  previousLabel,
  nextLabel,
  containerClassName,
  ...props
}) => {
  return (
    <ReactPaginate
      containerClassName={containerClassName}
      previousLabel={previousLabel}
      nextLabel={nextLabel}
      {...props}
    ></ReactPaginate>
  );
};

Paginate.defaultProps = {
  previousLabel: "chip",
  nextLabel: "Chipnext",
  containerClassName: "org",
};
export default Paginate;
