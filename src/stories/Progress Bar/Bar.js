import React from "react";
import PropTypes from "prop-types";
import "./Bar.scss";

const Setvalue = (20560 / 100000) * 100;

export const Bar = ({ value, max, ...props }) => {
  return (
    <div>
      <h1 className="heading">Trees planted till date,</h1>
      <p className="count">20,560/100,000</p>
      <progress value={Setvalue} max={max} className="bar" {...props} />
    </div>
  );
};

Bar.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
};

Bar.defaultProps = {
  max: "100",
};

export default Bar;
