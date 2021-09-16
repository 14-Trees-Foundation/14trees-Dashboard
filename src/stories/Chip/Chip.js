import React from "react";
import PropTypes from "prop-types";
import "./Chip.scss";

export const Chip = ({ mode, backgroundColor, label, handleClick, size, ...props }) => {

  return (
    <button
      type="button"
      className={[`button-chip-${size}`, `button-chip-${mode}`].join(" ")}
      style={backgroundColor && { backgroundColor }}
      onClick={() => handleClick(label)}
    >
      {label}
    </button>
  );
};

Chip.propTypes = {
  backgroundColor: PropTypes.string,
  mode: PropTypes.oneOf(["primary", "secondary"]),
  label: PropTypes.string.isRequired,
  handleClick: PropTypes.func,
  size: PropTypes.string
};

Chip.defaultProps = {
  backgroundColor: undefined,
  handleClick: undefined,
  mode: "secondary",
  size: 'large'
};

export default Chip;
