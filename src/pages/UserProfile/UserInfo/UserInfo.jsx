import { Fragment, useState, useEffect, useRef } from "react";
import { Dialog, Grid } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { useRecoilValue, useRecoilState } from "recoil";
import { gsap } from "gsap";
import { strEquals } from "../../../helpers/utils";

import { Memories } from "../Memories/Memories";
import { InfoChip } from "../../../stories/InfoChip/InfoChip";
import {
  usersData,
  selUsersData,
  openProfilePopup,
} from "../../../store/atoms";
import { Progress } from "../../../components/CircularProgress";

export const UserInfo = () => {
  const classes = useStyles();

  const [imgLoad, setImgLoad] = useState(false);
  const userinfo = useRecoilValue(usersData);
  const selUserInfo = useRecoilValue(selUsersData);
  const [open, setOpenPopup] = useRecoilState(openProfilePopup);

  const gridRefs = useRef([]);
  const plantationDetailsRef = useRef(null);

  gridRefs.current = [];

  const addToRefs = (el) => {
    if (el && !gridRefs.current.includes(el)) {
      gridRefs.current.push(el);
    }
  };

  useEffect(() => {
    const tl = gsap.timeline();
  
    gridRefs.current.forEach((el, index) => {
      // tl.fromTo(
      //   el,
      //   { opacity: 0, y: 20 },
      //   { opacity: 1, y: 0, duration: 3, ease: "power3.out" },
      //   0.5
      // );

      // Add a stagger effect
      tl.staggerFromTo(
        el,
        0.5,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, ease: "power3.out" },
        0.2 // Stagger delay
      );

      const divs = plantationDetailsRef.current.querySelectorAll("div");

      gsap.fromTo(
        divs,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.2, // Stagger the animations
        }
      );
      
    });
  
    
  }, []);

  const handleTreeClick = () => {
    // setIndex(2);
  };

  const onTogglePop = () => {
    setOpenPopup(!open);
  };

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  const treeDoneWidth = (userinfo.user_trees.length / 14) * 100;

  if (open) {
    return (
      <div>
        <Dialog onClose={onTogglePop} open={open}>
          <img
            className={imgLoad ? classes.imageWindow : classes.none}
            src={
              selUserInfo.user_tree_image && selUserInfo.user_tree_image !== ""
                ? selUserInfo.user_tree_image
                : selUserInfo.image && selUserInfo.image !== ""
                ? selUserInfo.image
                : selUserInfo.plant_type_images &&
                  selUserInfo.plant_type_images.length > 0
                ? selUserInfo.plant_type_images[0]
                : ""
            }
            alt={"A"}
          />
        </Dialog>
      </div>
    );
  } else {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <Grid container>
          <Grid item xs={6} md={3} sx={{ maxHeight: "260px" }} ref={addToRefs}>
            {!imgLoad && <Progress />}
            <img
              onClick={() => handleOpenPopup()}
              className={imgLoad ? classes.userimg : classes.none}
              alt="Card"
              onLoad={() => setImgLoad(true)}
              src={
                selUserInfo.user_tree_image && selUserInfo.user_tree_image !== ""
                  ? selUserInfo.user_tree_image
                  : selUserInfo.image && selUserInfo.image !== ""
                  ? selUserInfo.image
                  : selUserInfo.plant_type_images &&
                    selUserInfo.plant_type_images.length > 0
                  ? selUserInfo.plant_type_images[0]
                  : ""
              }
            />
          </Grid>
          <Grid item xs={6} md={3} className={classes.infobox} ref={addToRefs} id='plantation_details'>
            <div className={classes.info} ref={plantationDetailsRef}>
              {selUserInfo.event_type && selUserInfo.event_type === "2" ? (
                <div className={classes.label}>In Memory of</div>
              ) : (
                <div className={classes.label}>Name</div>
              )}
              <div className={classes.data}>{selUserInfo.assigned_to}</div>
              <>
                {(selUserInfo.gifted_by_name ||
                  (selUserInfo.gifted_by_user !== undefined &&
                    !strEquals(
                      selUserInfo.gifted_by_user,
                      selUserInfo.assigned_to
                    ) &&
                    !strEquals(selUserInfo.gifted_by_user, "ACM India") &&
                    !strEquals(selUserInfo.gifted_by_user, "ACM India Council") &&
                    selUserInfo.gifted_by)) && (
                  <>
                    <div className={classes.label}>Gifted By</div>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: "600",
                        marginBottom: "8px",
                      }}
                    >
                      {selUserInfo.gifted_by_name ||
                        selUserInfo.gifted_by_user}
                    </div>
                  </>
                )}
                {!(selUserInfo.gifted_by_name || selUserInfo.gifted_by_user) &&
                  selUserInfo.planted_by &&
                  selUserInfo.planted_by !== undefined && (
                    <>
                      <div className={classes.label}>
                        {strEquals(selUserInfo.planted_by, "ACM India Council")
                          ? "Planted via"
                          : "Planted By"}
                      </div>
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: "600",
                          marginBottom: "8px",
                        }}
                      >
                        {selUserInfo.planted_by}
                      </div>
                    </>
                  )}
                {selUserInfo.description &&
                  selUserInfo.description.trim() !== "" && (
                    <div>
                      <div className={classes.label}>Event</div>
                      <div
                        className={classes.data}
                        style={{ fontStyle: "italic", fontSize: "15px" }}
                      >
                        {selUserInfo.description}
                      </div>
                    </div>
                  )}
                {!selUserInfo.planted_by &&
                  !selUserInfo.gifted_by_name &&
                  !selUserInfo.gifted_by_user && (
                    <Fragment>
                      <div className={classes.growth}>
                        <div style={{ marginTop: "20px" }}>
                          <div style={{ display: "flex" }}>
                            <InfoChip
                              count={userinfo.user_trees.length}
                              label="Trees Planted"
                              onClick={handleTreeClick}
                            />
                          </div>
                          {14 - userinfo.user_trees.length > 0 && (
                            <div className={classes.overall}>
                              <div
                                className={classes.done}
                                style={{ width: `${treeDoneWidth}%` }}
                              ></div>
                              <div className={classes.count}>
                                {Math.max(
                                  14 - userinfo.user_trees.length,
                                  0
                                )}
                                <div className={classes.countdesc}>
                                  Trees away from neutralising your carbon
                                  footprint
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Fragment>
                  )}
              </>
            </div>
          </Grid>
          <Grid item xs={12} md={6} ref={addToRefs}>
            <Memories />
          </Grid>
        </Grid>
      </div>
    );
  }
};

const useStyles = makeStyles((theme) =>
  createStyles({
    grid: {
      // '& .MuiGrid-root': {
      //     paddingLeft: '0'
      // }
    },
    none: {
      display: "none",
    },
    userimg: {
      width: "100%",
      height: "100%",
      maxHeight: "260px",
      borderRadius: "15px",
      objectFit: "cover",
      maxWidth: "250px",
      cursor: "pointer",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": {
        transform: "scale(1.05)", // Slightly scale up the image
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Add shadow
      },
      [theme.breakpoints.down("1500")]: {
        maxHeight: "220px",
        maxWidth: "210px",
      },
    },
    infobox: {
      height: "260px",
      position: "relative",
      [theme.breakpoints.down("1500")]: {
        height: "220px",
      },
    },
    info: {
      paddingLeft: "20px",
      paddingTop: "10px",
      minHeight: "30%",
      [theme.breakpoints.down("480")]: {
        paddingLeft: "16px",
      },
      [theme.breakpoints.between("481", "900")]: {
        paddingLeft: "0px",
        marginLeft: "-10px",
      },
    },
    username: {
      lineHeight: "50px",
      fontSize: "28px",
      color: "#1F3625",
      paddingLeft: "20px",
      fontWeight: "500",
    },
    label: {
      fontSize: "13px",
      fontWeight: "300",
      [theme.breakpoints.down("1025")]: {
        fontSize: "10px",
      },
    },
    data: {
      fontSize: "17px",
      fontWeight: "600",
      marginBottom: "8px",
      [theme.breakpoints.down("1025")]: {
        fontSize: "16px",
      },
      [theme.breakpoints.down("720")]: {
        fontSize: "14px",
      },
    },
    growth: {
      [theme.breakpoints.between("481", "900")]: {
        paddingLeft: "0px",
        marginLeft: "-10px",
      },
    },
    overall: {
      display: "flex",
      backgroundColor: "#1F3625",
      marginTop: "7%",
      color: "#ffffff",
      fontWeight: "350",
      minHeight: "50px",
      borderRadius: "10px",
      maxWidth: "180px",
      [theme.breakpoints.down("1500")]: {
        minHeight: "40px",
      },
    },
    done: {
      backgroundColor: "#9BC53D",
      borderRadius: "10px",
      alignItems: "center",
      fontWeight: "400",
      fontSize: "25px",
    },
    count: {
      fontWeight: "450",
      position: "absolute",
      marginLeft: "0.25em",
      marginTop: "0.25em",
      fontSize: "25px",
      display: "flex",
    },
    countdesc: {
      fontSize: "11px",
      textAlign: "center",
      maxWidth: "150px",
      [theme.breakpoints.down("1025")]: {
        fontSize: "9px",
      },
    },
    imageWindow: {
      height: "auto",
      borderRadius: "20px",
      objectFit: "cover",
      padding: "2%",
      width: "auto",
      maxWidth: "540px",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": {
        transform: "scale(1.05)", // Slightly scale up the image
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Add shadow
      },
    },
  })
);
