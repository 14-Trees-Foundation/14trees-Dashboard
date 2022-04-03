import React from "react";
import PropTypes from "prop-types";
import CancelIcon from "@mui/icons-material/Cancel";
import { createStyles, makeStyles } from "@mui/styles";

export const Popup = ({ toggle, ...props }) => {
  const classes = useStyles();
  return (
    <div className={classes.main}>
      <div className={classes.window}>
        <div className={classes.close} onClick={toggle}>
          <CancelIcon fontSize={"medium"} />
        </div>
        {props.children}
      </div>
    </div>
  );
};

Popup.propTypes = {
  toggle: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) =>
  createStyles({
    main: {
      background: "rgba(110, 121, 113, 0.41)",
      backdropFilter: "blur(54px)",
      width: "100%",
      height: "100%",
      top: "0",
      left: "0",
      position: "fixed",
      zIndex: "99999999",
    },
    window: {
      width: "80%",
      height: "80%",
      marginLeft: "10vw",
      marginTop: "10vh",
      backgroundColor: "#1F3625",
      borderRadius: "5px",
      position: "absolute",
      [theme.breakpoints.down("480")]: {
        height: "60vh",
        marginTop: "20vh",
        width: "90vw",
        marginLeft: "5vw",
      },
    },
    close: {
      float: "right",
      paddingTop: "10px",
      paddingRight: "10px",
      cursor: "pointer",
      color: "#ffffff",
      [theme.breakpoints.down("480")]: {
        paddingTop: "5px",
        paddingRight: "5px",
      },
    },
  })
);

export default Popup;
