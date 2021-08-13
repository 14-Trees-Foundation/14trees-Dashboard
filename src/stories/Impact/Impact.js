import React from "react";
import PropTypes from "prop-types";
import { Card } from "primereact/card";
import "./Impact.scss";

const header = <h1 className="headerTxt">190</h1>;

const footer = (
  <p className="footertxt">
    Ponds created systematically to increase the water table
  </p>
);

export const Impact = ({ mode, ...props }) => {
  return (
    <Card
      className={[`box--${mode}`]}
      header={header}
      footer={footer}
      {...props}
    ></Card>
  );
};

Impact.propTypes = {
  mode: PropTypes.oneOf(["active", "normal"]),
};
Impact.defaultProps = {
  mode: "normal",
};
export default Impact;
