import { createStyles, makeStyles } from "@mui/styles";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";

// import { useState } from "react";
import { UserInfo } from "./UserInfo/UserInfo";
import { Trees } from "./Trees/Trees";
import { Map } from "./Map/Map";

import { useRecoilValue } from "recoil";
import { selUsersData } from "../../store/atoms";

import logo from "../../assets/icon_round.png";
import { Button } from "@mui/material";
import { useEffect } from "react";

export const Profile = ({ saplingId }) => {
  const matches = useMediaQuery("(max-width:481px)");
  const classes = useStyles();
  const selUserInfo = useRecoilValue(selUsersData);

  const username = selUserInfo.user.name.split(" ")[0];

  useEffect(() => {
    document.title = "14Trees Dashboard - Profile: " + username;
  }, [username])

  const header = () => {
    if (!matches) {
      return (
        <div className={classes.header}>
          <img src={logo} alt={logo} className={classes.img} />
          <div className={classes.username}>
            {selUserInfo.tree.event_type && selUserInfo.tree.event_type === "2"
              ? "Memorial Dashboard"
              : `${username}'s Dashboard`}
          </div>
          {selUserInfo.tree.event_type && (selUserInfo.tree.event_type === "2" || selUserInfo.tree.event_type === "4") ? (
            ""
          ) : (
            <div style={{ justifyContent: "flex-end" }}>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  window.open(
                    "https://14trees.org/projects/reforestation-vetale/"
                  );
                }}
              >
                Gift a Tree
              </Button>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className={matches ? classes.mbmain : classes.main}>
      {header()}
      <Divider style={{ marginLeft: "4%", marginRight: "4%" }} />
      <div style={{ padding: "4%" }}>
        <div className={classes.user}>
          <UserInfo />
        </div>
        <div className={classes.treemap}>
          <div style={{ display: matches ? "block" : "flex" }}>
            <div className={classes.tree}>
              <Trees saplingId={saplingId} />
            </div>
            <div className={classes.map}>
              <Map />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) =>
  createStyles({
    mbmain: {
      height: "100%",
      marginTop: "50px",
    },
    main: {
      height: "100%",
    },
    img: {
      width: "50px",
      height: "50px",
      marginLeft: "0",
      [theme.breakpoints.down("480")]: {
        width: "35px",
        height: "35px",
      },
    },
    header: {
      display: "flex",
      justifyContent: "flex-end",
      height: "5vh",
      padding: "3.5vh",
      [theme.breakpoints.down("1500")]: {
        height: "4vh",
        padding: "3vh",
      },
      [theme.breakpoints.down("480")]: {
        height: "3vh",
        padding: "3vh",
      },
    },
    username: {
      lineHeight: "50px",
      fontSize: "34px",
      color: "#1F3625",
      fontWeight: "500",
      marginLeft: "20px",
      marginRight: "auto",
      [theme.breakpoints.down("1500")]: {
        lineHeight: "40px",
        fontSize: "28px",
      },
      [theme.breakpoints.down("480")]: {
        lineHeight: "40px",
        fontSize: "20px",
      },
    },
    user: {
      display: "flex",
      minHeight: "22vh",
      [theme.breakpoints.down("1500")]: {
        minHeight: "32vh",
      },
      [theme.breakpoints.down("481")]: {
        minHeight: "100%",
      },
    },
    treemap: {
      fontSize: "30px",
      height: "50vh",
      marginTop: "20px",
      [theme.breakpoints.down("1500")]: {
        height: "52vh",
        marginTop: "5px",
      },
    },
    tree: {
      width: "40%",
      height: "50vh",
      zIndex: "1",
      [theme.breakpoints.down("1500")]: {
        height: "52vh",
      },
      [theme.breakpoints.down("1025")]: {
        width: "50%",
      },
      [theme.breakpoints.down("480")]: {
        width: "100%",
        height: "60%",
        maxHeight: "400px",
        overflowY: "auto",
        marginRight: "0",
        marginTop: "10px",
        marginBottom: "-30px",
        position: "relative",
      },
    },
    map: {
      width: "60%",
      height: "50vh",
      [theme.breakpoints.down("1500")]: {
        height: "52vh",
      },
      [theme.breakpoints.down("1025")]: {
        width: "55%",
      },
      [theme.breakpoints.down("480")]: {
        width: "100%",
        height: "60vh",
        marginRight: "0px",
        marginLeft: "0px",
        paddingBottom: "20px",
      },
    },
  })
);
