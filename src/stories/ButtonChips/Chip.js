import React from "react";
import PropTypes from "prop-types";
import "./Chip.scss";

export const Chip = ({ mode, backgroundColor, label, handleClick, ...props }) => {

  return (
    <button
      type="button"
      className={["button-chip", `button-chip-${mode}`].join(" ")}
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
};

Chip.defaultProps = {
  backgroundColor: undefined,
  handleClick: undefined,
  mode: "primary",
};

export default Chip;
