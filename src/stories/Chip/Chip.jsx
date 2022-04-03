import React from "react";
import PropTypes from "prop-types";
import { createStyles, makeStyles } from "@mui/styles";

export const Chip = ({
  mode,
  backgroundColor,
  label,
  handleClick,
  size,
  ...props
}) => {
  const classes = useStyles();

  const s = `chip${size}`;
  const m = `chip${mode}`;

  return (
    <button
      type="button"
      className={`${classes[s]} ${classes[m]}`}
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
  size: PropTypes.string,
};

Chip.defaultProps = {
  backgroundColor: undefined,
  handleClick: undefined,
  mode: "secondary",
  size: "large",
};

const useStyles = makeStyles((theme) =>
  createStyles({
    chipsmall: {
      fontSize: "13px",
      minHeight: "28px",
      borderRadius: "40px",
      fontWeight: "500",
      textAlign: "center",
      cursor: "pointer",
      paddingLeft: "2em",
      paddingRight: "2em",
      margin: "0 0.5em 0 0.8em",
      [theme.breakpoints.down("1025")]: {
        minHeight: "26px",
        fontSize: "11px",
      },
    },
    chiplarge: {
      fontSize: "15px",
      minHeight: "35px",
      borderRadius: "40px",
      fontWeight: "500",
      textAlign: "center",
      cursor: "pointer",
      paddingLeft: "2em",
      paddingRight: "2em",
      margin: "0 0.5em 0 0.8em",
    },
    chipprimary: {
      border: "1px solid #9bc53d",
      backgroundColor: "#9bc53d",
      color: "#ffffff",
    },
    chipsecondary: {
      border: "1px solid rgba(31, 54, 37, 0.1)",
      backgroundColor: "#1F3625",
      color: "#fff",
    },
  })
);

export default Chip;
