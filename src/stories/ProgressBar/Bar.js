import React from "react";
import PropTypes from "prop-types";
import "./Bar.scss";

const Setvalue = (20560 / 100000) * 100;

export const Bar = ({ value, max, ...props }) => {
  return (
    <div className="bar">
      <h1 className="heading">Trees planted till date</h1>
      <div className="count">20,560/100,000</div>
      <progress value={Setvalue} max={max} className="progress" {...props} />
    </div>
  );
};

Bar.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
};

Bar.defaultProps = {
  max: 100,
  value: 80
};

export default Bar;
