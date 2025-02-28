import { createStyles, makeStyles } from "@mui/styles";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";

// import { useState } from "react";
import { UserInfo } from "./UserInfo/UserInfo";
import { Trees } from "./Trees/Trees";
import { Map } from "./Map/Map";

import { useRecoilValue } from "recoil";
import { selUsersData, usersData } from "../../store/atoms";

import logo from "../../assets/icon_round.png";
import { Button } from "@mui/material";
import { useEffect } from "react";
import TreeTimelineInfo from "./Trees/TreeTimelineInfo";

export const Profile = ({ saplingId }) => {
  const matches = useMediaQuery("(max-width:481px)");
  const classes = useStyles();
  const selUserInfo = useRecoilValue(selUsersData);
  const usersInfo = useRecoilValue(usersData);

  const username = selUserInfo.assigned_to.split(" ")[0];
  const userId = selUserInfo.assigned_to_id;

  useEffect(() => {
    document.title = "14Trees Dashboard - Profile: " + username;
  }, [username])

  const header = () => {
    if (!matches) {
      return (
        <div className={classes.header}>
          <img src={logo} alt={logo} className={classes.img} />
          <div className={classes.username}>
            {selUserInfo.event_type && selUserInfo.event_type === "2"
              ? "Memorial Dashboard"
              : `${username}'s Dashboard`}
          </div>
          {selUserInfo.event_type && (selUserInfo.event_type === "2" || selUserInfo.event_type === "4") ? (
            ""
          ) : (
            <div style={{ justifyContent: "flex-end" }}>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  window.open(
                    "https://docs.google.com/forms/d/e/1FAIpQLSfumyti7x9f26BPvUb0FDYzI2nnuEl5HA63EO8svO3DG2plXg/viewform"
                  );
                }}
              >
                Gift a Tree
              </Button>
              {usersInfo.sponsored_trees > 0 && <Button
                variant="contained"
                color="primary"
                style={{ margin: "0 5px" }}
                onClick={() => {
                  const { hostname, host } = window.location;
                  if (hostname === "localhost" || hostname === "127.0.0.1") {
                    window.open("http://" + host + "/dashboard/" + userId);
                  } else {
                    window.open("https://" + hostname + "/dashboard/" + userId);
                  }
                }}
              >
                Your Sponsored View
              </Button>}
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
        {selUserInfo.tree_audits && selUserInfo.tree_audits.length > 1 && <div >
          <TreeTimelineInfo />
        </div>}
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
      maxHeight: "50vh",
      marginTop: "20px",
      [theme.breakpoints.down("1500")]: {
        maxHeight: "105vh",
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
      maxHeight: "50vh",
      marginLeft: "20px",
      [theme.breakpoints.down("1500")]: {
        maxHeight: "52vh",
        marginTop: "30px",
      },
      [theme.breakpoints.down("1025")]: {
        width: "55%",
      },
      [theme.breakpoints.down("480")]: {
        width: "100%",
        maxHeight: "60vh",
        marginRight: "0px",
        marginLeft: "0px",
        paddingBottom: "20px",
      },
    },
  })
);
