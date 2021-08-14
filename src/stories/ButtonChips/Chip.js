import React from "react";
import PropTypes from "prop-types";
import "./Chip.scss";

export const Chip = ({ mode, backgroundColor, label, ...props }) => {
  return (
    <button
      type="button"
      className={["button-chip", `button-chip-${mode}`].join(" ")}
      style={backgroundColor && { backgroundColor }}
      {...props}
    >
      {label}
    </button>
  );
};

Chip.propTypes = {
  backgroundColor: PropTypes.string,

  mode: PropTypes.oneOf(["primary", "secondary"]),

  label: PropTypes.string.isRequired,

  onClick: PropTypes.func,
};

Chip.defaultProps = {
  backgroundColor: undefined,
  onClick: undefined,
  mode: "primary",
};

export default Chip;
