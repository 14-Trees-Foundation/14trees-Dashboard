import React, { Fragment } from "react";
import logo from "../assets/logo_white_small.png";
import Button from "@mui/material/Button";
import { createStyles, makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";

export const AppBar = () => {
  const navigate = useNavigate();
  const classes = UseStyle();

  return (
    <Fragment>
      <div className={classes.appbar}>
        <nav className={classes.content}>
          <div className={classes.logo}>
            <img style={{ width: "40px" }} src={logo} alt="logo banner" />
          </div>
          <div className={classes.right}>
            {/* <h2 className={classes.links}>Home</h2>
                        <h2 className={classes.links}>Events</h2>
                        <h2 className={classes.links}>Search</h2>
                        <h2 className={classes.links}>About</h2> */}
            <Button
              variant="contained"
              color="primary"
              size="large"
              style={{ marginRight: "2%" }}
              onClick={() => navigate("/admin")}
            >
              Admin
            </Button>
          </div>
        </nav>
      </div>
    </Fragment>
  );
};

const UseStyle = makeStyles((theme) =>
  createStyles({
    appbar: {
      width: "calc(100vw - 32px)",
      position: "absolute",
      padding: "16px",
      top: "0",
      left: "0",
      [theme.breakpoints.down("md")]: {
        width: "calc(100vw - 16px)",
      },
    },
    content: {
      height: "67px",
      display: "flex",
      width: "100 %",
      flexDirection: "row",
      alignItems: "center",
      marginTop: "5px",
    },
    logo: {
      height: "60px",
      width: "60px",
      alignItems: "center",
      marginLeft: "1rem",
    },
    right: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    links: {
      fontWeight: "350",
      color: "#ffffff",
      marginLeft: "2%",
      marginRight: "2%",
      cursor: "pointer",
      [theme.breakpoints.down("md")]: {
        display: "none",
      },
    },
  })
);
