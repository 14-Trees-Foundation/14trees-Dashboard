import { Fragment, useState } from "react";
import { Dialog, Grid } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { useRecoilValue, useRecoilState } from "recoil";
import { strEquals } from "../../../helpers/utils";
// import { useSetRecoilState } from 'recoil';

import { Memories } from "../Memories/Memories";
import { InfoChip } from "../../../stories/InfoChip/InfoChip";
import {
  usersData,
  selUsersData,
  openProfilePopup,
} from "../../../store/atoms";
import { Progress } from "../../../components/CircularProgress";
// import { navIndex } from '../../../store/atoms';

export const UserInfo = () => {
  const classes = useStyles();

  const [imgLoad, setImgLoad] = useState(false);
  const userinfo = useRecoilValue(usersData);
  const selUserInfo = useRecoilValue(selUsersData);
  // const setIndex = useSetRecoilState(navIndex);
  const [open, setOpenPopup] = useRecoilState(openProfilePopup);
  const handleTreeClick = () => {
    // setIndex(2);
  };
  const onTogglePop = () => {
    setOpenPopup(!open);
  };

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  const treeDoneWidth = (userinfo.usertrees.length / 14) * 100;

  if (open) {
    return (
      <div>
        <Dialog onClose={onTogglePop} open={open}>
          <img
            className={imgLoad ? classes.imageWindow : classes.none}
            src={
              selUserInfo.profile_image[0] === ""
                ? selUserInfo.tree.image[0]
                : selUserInfo.profile_image[0]
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
          <Grid item xs={6} md={3} sx={{ maxHeight: "260px" }}>
            {!imgLoad && <Progress />}
            <img
              onClick={() => handleOpenPopup()}
              className={imgLoad ? classes.userimg : classes.none}
              alt="Card"
              onLoad={() => setImgLoad(true)}
              src={
                selUserInfo.profile_image[0] === ""
                  ? selUserInfo.tree.image
                    ? selUserInfo.tree.image[0]
                    : selUserInfo.tree.tree_type.image[0]
                  : selUserInfo.profile_image[0]
              }
            />
          </Grid>
          <Grid item xs={6} md={3} className={classes.infobox}>
            <div className={classes.info}>
              {selUserInfo.tree.event_type &&
                selUserInfo.tree.event_type === "2" ? (
                <div className={classes.label}>In Memory of</div>
              ) : (
                <div className={classes.label}>Name</div>
              )}
              <div className={classes.data}>{selUserInfo.user.name}</div>
              {(selUserInfo.tree.event_type === "4" || selUserInfo.tree.desc) ? (
                <>
                  {selUserInfo.gifted_by &&
                    selUserInfo.gifted_by !== undefined && !strEquals(selUserInfo.gifted_by, selUserInfo.user.name) && !strEquals(selUserInfo.gifted_by, "ACM India") && !strEquals(selUserInfo.gifted_by, "ACM India Council") && selUserInfo.gifted_by && (
                      <>
                        <div className={classes.label}>Donated By</div>
                        <div
                          style={{
                            fontSize: "15px",
                            fontWeight: "600",
                            marginBottom: "8px",
                          }}
                        >
                          {selUserInfo.gifted_by}
                        </div>
                      </>
                    )}
                  {selUserInfo.planted_by &&
                    selUserInfo.planted_by !== undefined && (
                      <>
                        <div className={classes.label}>{strEquals(selUserInfo.planted_by, "ACM India Council") ? "Planted via" : "Planted By"}</div>
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
                  {
                    <div>
                      <div className={classes.label}>Event</div>
                      <div
                        className={classes.data}
                        style={{ fontStyle: "italic", fontSize: "15px" }}
                      >
                        {selUserInfo.tree.desc}
                      </div>
                    </div>
                  }
                  {!selUserInfo.planted_by && (
                    <Fragment>
                      <div className={classes.growth}>
                        <div style={{ marginTop: "20px" }}>
                          <div style={{ display: "flex" }}>
                            <InfoChip
                              count={userinfo.usertrees.length}
                              label="Trees Planted"
                              onClick={handleTreeClick}
                            />
                          </div>
                          <div className={classes.overall}>
                            <div
                              className={classes.done}
                              style={{ width: `${treeDoneWidth}%` }}
                            ></div>
                            <div className={classes.count}>
                              {14 - userinfo.usertrees.length}
                              <div className={classes.countdesc}>
                                Trees away from neutralising your carbon
                                footprint
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  )
                  }
                </>
              ) : (
                <>
                  {selUserInfo.donated_by &&
                    selUserInfo.donated_by._id !== selUserInfo.user._id && !strEquals(selUserInfo.gifted_by, "ACM India") && !strEquals(selUserInfo.gifted_by, "ACM India Council") && !(!selUserInfo.gifted_by && (strEquals(selUserInfo.donated_by.name, "ACM India") || strEquals(selUserInfo.donated_by.name, "ACM India Council"))) && (
                      <>
                        <div className={classes.label}>Donated By</div>
                        {selUserInfo.gifted_by &&
                          selUserInfo.gifted_by !== "undefined" ? (
                          <div className={classes.data}>
                            {selUserInfo.gifted_by}
                          </div>
                        ) : (
                          <div className={classes.data}>
                            {selUserInfo.donated_by.name}
                          </div>
                        )}
                      </>
                    )}
                  {selUserInfo.planted_by &&
                    selUserInfo.planted_by !== undefined && (

                      <>
                        <div className={classes.label}>{
                          strEquals(selUserInfo.planted_by, "ACM India Council") ? "Planted via" : "Planted By"
                        }</div>
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
                  {(!selUserInfo.planted_by) && (
                    (selUserInfo.donated_by !== undefined &&
                      selUserInfo.donated_by._id === selUserInfo.user._id) ? (
                      <>
                        <div className={classes.label}>Organization</div>
                        <div className={classes.data}>
                          {selUserInfo.orgid.name}
                        </div>
                      </>
                    ) : ("")
                  )}
                  {/* {(selUserInfo.planted_by || (selUserInfo.donated_by !== undefined &&
                    selUserInfo.donated_by._id !== selUserInfo.user._id)) && (
                      <>
                        <div className={classes.label}>Tree Name</div>
                        <div className={classes.data}>
                          {selUserInfo.tree.tree_type.name}
                        </div>
                      </>
                    )} */}
                  {((!selUserInfo.planted_by && !selUserInfo.donated_by) ||
                    (selUserInfo.donated_by && selUserInfo.donated_by._id === selUserInfo.user._id)) ? (
                    <Fragment>
                      <div className={classes.growth}>
                        <div style={{ marginTop: "20px" }}>
                          <div style={{ display: "flex" }}>
                            <InfoChip
                              count={userinfo.usertrees.length}
                              label="Trees Planted"
                              onClick={handleTreeClick}
                            />
                          </div>
                          <div className={classes.overall}>
                            <div
                              className={classes.done}
                              style={{ width: `${treeDoneWidth}%` }}
                            ></div>
                            <div className={classes.count}>
                              {14 - userinfo.usertrees.length}
                              <div className={classes.countdesc}>
                                Trees away from neutralising your carbon
                                footprint
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  ) :
                    // (selUserInfo.planted_by ||
                    //   (selUserInfo.donated_by && selUserInfo.donated_by._id !== selUserInfo.user._id)) && (
                    //   <>
                    //     <div className={classes.label}>Location</div>
                    //     <div className={classes.data}>
                    //       {selUserInfo.tree.plot.name}
                    //     </div>
                    //   </>
                    // )
                    <></>
                  }
                </>
              )}
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
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
    },
  })
);
