import React from "react";
import { createStyles, makeStyles } from "@mui/styles";

export const Impact = ({ count, text, size, ...props }) => {
  const classes = useStyles();
  return (
    <div className={classes[`card${size}`]}>
      <div className={classes.header}>{count}</div>
      <div className={classes.footer}>{text}</div>
    </div>
  );
};

Impact.defaultProps = {
  count: "190",
  text: "14 Trees",
  size: "small",
};

const useStyles = makeStyles((theme) =>
  createStyles({
    cardsmall: {
      margin: "7px 7px 7px 0",
      minWidth: "70px",
      maxWidth: "190px",
      minHeight: "15%",
      backgroundColor: "#ffffff",
      borderRadius: "18px",
      padding: "20px",
    },
    cardlarge: {
      margin: "7px 7px 7px 0",
      minWidth: "82%",
      maxWidth: "400px",
      backgroundColor: "#ffffff",
      borderRadius: "18px",
      padding: "20px",
      [theme.breakpoints.down("lg")]: {
        minWidth: "78%",
      },
    },
    header: {
      fontSize: "30px",
      fontWeight: "600",
      color: "#9BC53D",
      textAlign: "center",
    },
    footer: {
      paddingTop: "5px",
      fontSize: "12px",
      fontWeight: "500",
      textAlign: "center",
    },
  })
);
