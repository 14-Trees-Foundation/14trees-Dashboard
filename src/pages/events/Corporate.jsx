import { Fragment, useCallback, useEffect, useState } from "react";

import { createStyles, makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Carousel from "react-gallery-carousel";

import { Appbar } from "./Appbar";
import item1 from "../../assets/item1.png";
import item2 from "../../assets/item2.png";
import vector1 from "../../assets/vector1.png";
import vector2 from "../../assets/treevector.png";
import gatimg from "../../assets/gaticon.png";
import treeicon from "../../assets/treeicon.png";
import footicon from "../../assets/footicon.png";
import footericon from "../../assets/footericon.png";
import "react-gallery-carousel/dist/index.css";
import HorizontalTimeline from "react-horizontal-timeline";

import { Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import * as Axios from "../../api/local";
import { NotFound } from "../notfound/NotFound";
import { Spinner } from "../../components/Spinner";

export const Corporate = () => {
  const { event_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(true);
  const [trees, setTrees] = useState([]);
  const [found, setFound] = useState(true);
  const [value, setValue] = useState(0);
  const [dates, setDates] = useState([]);

  //   const [index, setIndex] = useState(8);

  //   const loadMore = () => {
  //     const newIndex = index + 8;
  //     const newShowMore = newIndex < 19;
  //     const newList = treeimages.slice(0, newIndex);
  //     setIndex(newIndex);

  //   };

  //   const collapse = () => {
  //     setIndex(8);
  //     setTreeList(treeimages.slice(0, 8));
  //     setShowMore(true);
  //   };

  const formatTrees = async (data) => {
    let dates = [];
    dates.push(data["date_added"].slice(0, 10));
    dates.push("2022-06-14");
    setDates(dates);
    setTrees(
      data["trees"].sort(function (a, b) {
        return a.sapling_id - b.sapling_id;
      })
    );
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await Axios.default.get(
        `/events/corp?event_id=${event_id}`
      );
      await formatTrees(response.data["event"][0]);
      if (response.status === 200) {
        setData(response.data["event"][0]);
      } else {
        setFound(false);
      }
    } catch (error) {
      setFound(false);
    }
    setLoading(false);
  }, [event_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const classes = useStyles();
  if (loading) {
    return <Spinner />;
  } else if (!found) {
    return <NotFound />;
  } else {
    return (
      <Fragment>
        <div className={classes.main}>
          <Appbar />
          <div className={classes.header}>
            <Box>
              <Grid container spacing={4}>
                <Grid item xs={12} md={5}>
                  <div className={classes.logos}>
                    <img
                      className={classes.logo}
                      src={data["logo"][0]}
                      alt="logo"
                    />
                  </div>
                  <p className={classes.maintxt}>{data["title"]}</p>
                  <Divider style={{ background: "#ffffff", width: "85%" }} />
                  <div className={classes.detail}>
                    <div style={{ marginBottom: "5px" }}>
                      Event name: <b>{data["event_name"]}</b>
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                      Organized On: <b>{data["date_added"].slice(0, 10)}</b>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className={classes.num}>{data["num_people"]}</div>
                    <div className={classes.numDetail}>People Attended</div>
                    <div style={{ width: "20px" }}></div>
                    <div className={classes.num}>{data["trees"].length}</div>
                    <div className={classes.numDetail}>Trees Planted</div>
                  </div>
                </Grid>
                <Grid item xs={12} md={7}>
                  <div style={{ position: "relative" }}>
                    <img className={classes.item2} src={item2} alt="item1" />
                    <img
                      className={classes.headerimg}
                      src={data["header_img"]}
                      alt="header logo"
                    />
                    <img className={classes.item1} src={item1} alt="item2" />
                  </div>
                </Grid>
              </Grid>
            </Box>
          </div>
          <img className={classes.topvector} src={vector1} alt="vector1" />
          <div className={classes.general}>
            <div className={classes.msgTitle}>{data["short_desc"]}</div>
            <div className={classes.imageC}>
              <Carousel
                hasMediaButton={false}
                hasIndexBoard={false}
                images={data["album"].map((x) => ({
                  src: x,
                }))}
              />
            </div>
            <div className={classes.msg}>{data["long_desc"]}</div>
            <div className={classes.gatinfo}>
              <div
                style={{
                  width: "130px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <img src={gatimg} alt="gat" className={classes.gatimg} />
              </div>
              <div className={classes.gatheader}>
                Site of Plantation: Near {data["plot"]["name"]}
              </div>
              <div className={classes.gatdesc}>{data["plot_desc"]}</div>
            </div>
          </div>
          <div style={{ height: "900px" }}>
            <div
              style={{
                position: "relative",
                top: "-100px",
                height: "400px",
                background:
                  "linear-gradient(360deg, rgba(233, 234, 231, 0) 0%, #E5E5E7 58.96%)",
                zIndex: "-1",
              }}
            ></div>
            <img
              src={data["plot_img"]}
              className={classes.plotimg}
              alt=""
            />
            <div
              style={{
                top: "-900px",
                position: "relative",
                height: "400px",
                transform: "rotate(180deg)",
                background:
                  "linear-gradient(360deg, rgba(150, 120, 95, 0) 0%, #1F3625 85.27%)",
                zIndex: "4",
                marginBottom: "-550px",
              }}
            ></div>
          </div>
          <div className={classes.trees}>
            <div
              style={{
                width: "130px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <img src={treeicon} alt="tree" className={classes.treeicon} />
            </div>
            <div className={classes.treedesc}>The Trees Planted</div>
            <div className={classes.h}>
              <HorizontalTimeline
                linePadding={100}
                minEventPadding={100}
                maxEventPadding={100}
                styles={{ outline: "#fff", foreground: "#9BC53D" }}
                index={value}
                indexClick={(index) => {
                  setValue(index);
                }}
                values={dates}
              />
            </div>
            <div className={classes.treeimgcontainer}>
              <Grid container spacing={3}>
                {trees.map((tree, idx) => {
                  return (
                    <Grid item xs={6} md={3}>
                      <img
                        src={
                          value === 0
                            ? tree["image"][0]
                            : tree["updates"]["photo_update"][0]["image"]
                        }
                        alt=""
                        className={classes.treeimg}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            padding: "5px",
                            fontWeight: "500",
                            fontSize: "16px",
                            color: "#ffffff",
                          }}
                        >
                          {tree["tree_types"]["name"]}
                        </div>
                        <div
                          style={{
                            padding: "5px",
                            fontWeight: "400",
                            fontSize: "14px",
                            color: "#ffffff",
                          }}
                        >
                          #{tree["sapling_id"]}
                        </div>
                      </div>
                      {value === 0 && (
                        <div
                          style={{
                            padding: "5px",
                            color: "#fff",
                            fontSize: "13px",
                            fontWeight: "500",
                          }}
                        >
                          <i>Planted On: {tree["date_added"].slice(0, 10)}</i>
                        </div>
                      )}
                      {value !== 0 && (
                        <div
                          style={{
                            padding: "5px",
                            color: "#fff",
                            fontSize: "13px",
                            fontWeight: "500",
                          }}
                        >
                          <i>
                            Updated On:{" "}
                            {tree["updates"]["photo_update"][0][
                              "date_added"
                            ].slice(0, 10)}
                          </i>
                        </div>
                      )}
                    </Grid>
                  );
                })}
              </Grid>
              {/* {showMore && (
                  <div style={{ padding: "24px", textAlign: "center" }}>
                    <Chip
                      label={"See More"}
                      mode={"primary"}
                      size={"large"}
                      handleClick={() => loadMore()}
                    />
                  </div>
                )}
                {!showMore && (
                  <div style={{ padding: "24px", textAlign: "center" }}>
                    <Chip
                      label={"See less"}
                      mode={"primary"}
                      size={"large"}
                      handleClick={() => collapse()}
                    />
                  </div>
                )} */}
            </div>
          </div>
          <img src={vector2} alt="" className={classes.treefootvector} />
          <div className={classes.footer}>
            <div
              style={{
                width: "150px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <img src={footicon} alt="" style={{ height: "120px" }} />
            </div>
            <div className={classes.footthanks}>
              We thank you for your contribution!
            </div>
            <img src={footericon} alt="" className={classes.footericon} />
          </div>
        </div>
      </Fragment>
    );
  }
};

const useStyles = makeStyles((theme) =>
  createStyles({
    main: {
      maxHeight: "120px",
      backgroundColor: "#846C5B",
    },
    header: {
      padding: theme.spacing(15),
      backgroundColor: "#846C5B",
      paddingTop: theme.spacing(4),
      height: "calc(100vh - 200px)",
      maxWidth: "100vw",
      marginLeft: "auto",
      marginRight: "auto",
      [theme.breakpoints.down("480")]: {
        padding: theme.spacing(3),
        height: "calc(100vh * 1.3)",
      },
    },
    item2: {
      position: "absolute",
      zIndex: "1",
      width: "130px",
      height: "80px",
      left: "-40px",
      [theme.breakpoints.down("480")]: {
        width: "100px",
        height: "80px",
        left: "-20px",
      },
    },
    item1: {
      position: "absolute",
      zIndex: "1",
      width: "80px",
      height: "80px",
      left: "90%",
      top: "58vh",
      [theme.breakpoints.down("480")]: {
        left: "80%",
        top: "35vh",
      },
    },
    headerimg: {
      position: "absolute",
      width: "100%",
      height: "65vh",
      top: "10px",
      objectFit: "cover",
      [theme.breakpoints.down("480")]: {
        height: "45vh",
      },
    },
    logos: {
      display: "flex",
      [theme.breakpoints.up("1480")]: {
        marginTop: "10%",
      },
    },
    logo: {
      maxWidth: "360px",
      height: "80px",
    },
    maintxt: {
      fontSize: "40px",
      lineHeight: "60px",
      color: "#ffffff",
      fontWeight: "bold",
      [theme.breakpoints.down("480")]: {
        fontSize: "35px",
        lineHeight: "50px",
      },
    },
    detail: {
      color: "#ffffff",
      fontSize: "18px",
      fontWeight: "350",
      marginTop: theme.spacing(6),
      display: "block",
    },
    num: {
      fontSize: "45px",
      color: "#EDD9A3",
      fontWeight: "500",
    },
    numDetail: {
      fontSize: "13px",
      width: "60px",
      color: "#ffffff",
      fontWeight: "400",
      padding: theme.spacing(1),
    },
    topvector: {
      width: "100%",
      height: "50px",
      [theme.breakpoints.down("480")]: {
        height: "15px",
      },
    },
    general: {
      backgroundColor: "#e5e5e5",
      marginTop: "-30px",
      padding: theme.spacing(15),
      [theme.breakpoints.down("480")]: {
        padding: theme.spacing(1),
        marginTop: "-10px",
      },
    },
    msgTitle: {
      color: "#846C5B",
      fontSize: "45px",
      lineHeight: "60px",
      fontWeight: "600",
      width: "70%",
      marginLeft: "auto",
      marginRight: "auto",
      textAlign: "center",
      [theme.breakpoints.down("480")]: {
        width: "85%",
        fontSize: "30px",
        lineHeight: "40px",
        marginTop: "20px",
      },
    },
    imageC: {
      marginTop: "40px",
      height: "75vh",
      width: "80%",
      marginLeft: "auto",
      marginRight: "auto",
      [theme.breakpoints.down("480")]: {
        width: "100%",
        height: "45vh",
      },
    },
    msg: {
      fontSize: "17px",
      lineHeight: "24px",
      paddingTop: "40px",
      color: "#54503C",
      fontWeight: "300",
      width: "80%",
      marginLeft: "auto",
      marginRight: "auto",
      whiteSpace: "pre-line",
    },
    gatinfo: {
      marginTop: "80px",
      width: "100%",
      zIndex: "4",
      [theme.breakpoints.down("480")]: {
        marginTop: "40px",
      },
    },
    plotimg: {
      top: "-500px",
      zIndex: "-2",
      width: "100%",
      position: "relative",
      height: "100%",
      objectFit: "cover",
      [theme.breakpoints.down("480")]: {
        height: "80%",
      },
    },
    gatimg: {
      height: "120px",
      width: "120px",
    },
    gatheader: {
      marginTop: "20px",
      width: "80%",
      marginLeft: "auto",
      marginRight: "auto",
      fontSize: "40px",
      textAlign: "center",
      color: "#846C5B",
      fontWeight: "600",
      [theme.breakpoints.down("480")]: {
        fontSize: "25px",
        width: "100%",
        marginTop: "5px",
      },
    },
    gatdesc: {
      fontSize: "17px",
      fontWeight: "300",
      textAlign: "center",
      color: "#54503C",
      width: "50%",
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: "20px",
      [theme.breakpoints.down("480")]: {
        width: "100%",
      },
    },
    trees: {
      backgroundColor: "#1F3625",
      width: "100%",
      marginTop: "-100px",
      [theme.breakpoints.down("480")]: {
        marginTop: "-280px",
      },
    },
    treeicon: {
      height: "120px",
      width: "120px",
      marginTop: "10px",
      [theme.breakpoints.down("480")]: {
        height: "85px",
        width: "85px",
        marginLeft: "20px",
      },
    },
    h: {
      width: "50%",
      maxWidth: "540px",
      marginTop: "20px",
      paddingBottom: "100px",
      marginLeft: "auto",
      marginRight: "auto",
      color: "#fff",
      [theme.breakpoints.down("480")]: {
        width: "90%",
      },
    },
    treedesc: {
      fontSize: "40px",
      fontWeight: "500",
      textAlign: "center",
      color: "#ffffff",
      width: "50%",
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: "20px",
      [theme.breakpoints.down("480")]: {
        fontSize: "25px",
        width: "80%",
      },
    },
    treeimgcontainer: {
      width: "80%",
      marginLeft: "auto",
      marginRight: "auto",
      [theme.breakpoints.down("480")]: {
        width: "90%",
      },
    },
    treeimg: {
      width: "100%",
      maxHeight: "300px",
      objectFit: "cover",
      borderRadius: "5px",
      [theme.breakpoints.down("480")]: {
        maxHeight: "180px",
      },
    },
    treefootvector: {
      height: "100px",
      width: "100%",
      [theme.breakpoints.down("480")]: {
        height: "50px",
      },
    },
    footer: {
      backgroundColor: "#e5e5e5",
      marginTop: "-80px",
      paddingTop: "80px",
      [theme.breakpoints.down("480")]: {
        marginTop: "-50px",
      },
    },
    footthanks: {
      width: "80%",
      color: "#1F3625",
      fontSize: "24px",
      fontWeight: "24px",
      marginLeft: "auto",
      marginRight: "auto",
      textAlign: "center",
      padding: "24px",
    },
    footericon: {
      height: "400px",
      width: "100%",
      objectFit: "cover",
      [theme.breakpoints.down("480")]: {
        height: "auto",
      },
    },
  })
);
