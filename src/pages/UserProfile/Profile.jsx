import { createStyles, makeStyles } from "@mui/styles";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

import { UserInfo } from "./UserInfo/UserInfo";
import { Trees } from "./Trees/Trees";
import { Map } from "./Map/Map";

import { useRecoilValue } from "recoil";
import { selUsersData, usersData } from "../../store/atoms";

import logo from "../../assets/icon_round.png";
import { Button } from "@mui/material";
import TreeTimelineInfo from "./Trees/TreeTimelineInfo";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard"; // Example icon import
import NaturePeopleIcon from "@mui/icons-material/NaturePeople"; // Example icon import


const getUsername = (fullname) => {
  if (!fullname) return "";

  const prefixes = ["Prof.", "Late", "Prof", "Rtn.", "Shri", "Mrs.", "Smt.", "Devi"];
  const parts = fullname.split(" ");
  let firstname = parts[0];

  if ((firstname.length <= 3 || prefixes.some(prefix => prefix.toLocaleLowerCase() === firstname.trim().toLocaleLowerCase())) && parts.length > 1) {
    firstname += " " + parts[1];
  }

  return firstname;
}

export const Profile = ({ saplingId }) => {
  const matches = useMediaQuery("(max-width:481px)");
  const classes = useStyles();
  const selUserInfo = useRecoilValue(selUsersData);
  const usersInfo = useRecoilValue(usersData);

  const username = selUserInfo.assigned_to;
  const userId = selUserInfo.assigned_to_id;

  const userNameRef = useRef(null);
  const headerRef = useRef(null);
  const dividerRef = useRef(null);
  const userInfoRef = useRef(null);
  const treesRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    document.title = "14Trees Dashboard - Profile: " + username;

    // GSAP animation for the username text
    gsap.fromTo(
      userNameRef.current,
      { width: 0, opacity: 0 },
      {
        duration: 2,
        width: "auto",
        opacity: 1,
        ease: "power3.out",
        overflow: "hidden",
        whiteSpace: "nowrap",
      });

    const tl = gsap.timeline();

    // tl.fromTo(
    //   headerRef.current,
    //   { opacity: 0, y: -20 },
    //   { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    // )
    tl.fromTo(
      dividerRef.current,
      { opacity: 0, scaleX: 0 },
      { opacity: 1, scaleX: 1, duration: 0.5, ease: "power3.out" },
      "-=0.5"
    )
      .fromTo(
        userInfoRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      )
      .fromTo(
        treesRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
      )
      .fromTo(
        mapRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
      );
  }, [username]);

  const header = () => {
    if (!matches) {
      return (
        <div className={classes.header} ref={headerRef}>
          <img src={logo} alt={logo} className={classes.img} />
          <div className={classes.username} ref={userNameRef}>
            {selUserInfo.event_type && selUserInfo.event_type === "2"
              ? "Memorial Dashboard"
              : `${username}'s Dashboard`}
          </div>
          {selUserInfo.event_type && (selUserInfo.event_type === "2" || selUserInfo.event_type === "4") ? (
            ""
          ) : (
            <div className={classes.buttonContainer}>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  window.open(
                    "https://docs.google.com/forms/d/e/1FAIpQLSfumyti7x9f26BPvUb0FDYzI2nnuEl5HA63EO8svO3DG2plXg/viewform"
                  );
                }}
                startIcon={<CardGiftcardIcon />}
              >
                <span className={classes.buttonText}>Gift a Tree</span>
              </Button>
              {usersInfo.sponsored_trees > 0 && <Button
                className={classes.sponsorViewButton}
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
                startIcon={<NaturePeopleIcon />}
              >
                <span className={classes.buttonText}>Your Sponsored View</span>
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
      <Divider style={{ marginLeft: "4%", marginRight: "4%" }} ref={dividerRef} />
      <div style={{ padding: "4%" }}>
        <div className={classes.user} ref={userInfoRef}>
          <UserInfo />
        </div>
        {matches && selUserInfo.tree_audits && selUserInfo.tree_audits.length > 1 && <div >
          <TreeTimelineInfo />
        </div>}
        <div className={classes.treemap}>
          <div style={{ display: matches ? "block" : "flex" }}>
            <div className={classes.tree} ref={treesRef}>
              <Trees saplingId={saplingId} />
            </div>
            <div className={classes.map} ref={mapRef}>
              <Map />
            </div>
          </div>
        </div>
        {!matches && selUserInfo.tree_audits && selUserInfo.tree_audits.length > 1 && <div style={{ marginTop: '20px' }}>
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
    // header: {
    //   display: "flex",
    //   justifyContent: "flex-end",
    //   height: "5vh",
    //   padding: "3.5vh",
    //   [theme.breakpoints.down("1500")]: {
    //     height: "4vh",
    //     padding: "3vh",
    //   },
    //   [theme.breakpoints.down("480")]: {
    //     height: "3vh",
    //     padding: "3vh",
    //   },
    // },
    header: {
      display: "flex",
      justifyContent: "space-between", // Adjust to space-between for better alignment
      alignItems: "center", // Center items vertically
      height: "5vh",
      padding: "3.5vh",
      [theme.breakpoints.down("1500")]: {
        height: "4vh",
        padding: "3vh",
      },
      [theme.breakpoints.down("480")]: {
        height: "auto", // Allow height to adjust based on content
        padding: "2vh",
        flexDirection: "column", // Stack items vertically on small screens
        alignItems: "flex-start", // Align items to the start
      },
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end",
      flexWrap: "wrap", // Allow buttons to wrap on smaller screens
      gap: "5px", // Add gap between buttons
      [theme.breakpoints.down("480")]: {
        justifyContent: "flex-start", // Align buttons to the start on small screens
        width: "100%", // Ensure full width for better alignment
      },
    },
    buttonText: {
      [theme.breakpoints.down("1145")]: {
        display: "none",
      },
    },
    sponsorViewButton: {
      [theme.breakpoints.down("1145")]: {
        display: "none",
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
        minHeight: "300px",
        marginRight: "0px",
        marginLeft: "0px",
        paddingBottom: "20px",
      },
    },
  })
);
