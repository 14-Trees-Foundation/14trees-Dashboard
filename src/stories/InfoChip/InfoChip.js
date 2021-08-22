import React from "react";
import PropTypes from "prop-types";
import "./infochip.scss";

export const InfoChip = ({ count, label, ...props }) => {
  return (
    <button
      type="button"
      className="infochip"
      {...props}
    >
      <div className="info">
        <div className="count">
          {count}
        </div>
        <div className="label">
          {label}
        </div>
      </div>
    </button>
  );
};

InfoChip.propTypes = {
  label: PropTypes.string.isRequired,
};

InfoChip.defaultProps = {
  count: 0,
  label: "Trees Planted",
};

export default InfoChip;
