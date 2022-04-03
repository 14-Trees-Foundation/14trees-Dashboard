import { useState } from "react";
import { useRecoilValue } from "recoil";
import { createStyles, makeStyles } from "@mui/styles";
import "react-gallery-carousel/dist/index.css";
import Carousel from "react-gallery-carousel";

import asset1 from "../../assets/events/birthday_1.png";
import asset2 from "../../assets/events/birthday_2.png";
import asset3 from "../../assets/events/asset3.png";
import asset4 from "../../assets/events/asset4.png";
import logo from "../../assets/events/logo.svg";
import trees from "../../assets/events/treesplanted.svg";
import footer from "../../assets/events/footer.svg";
import footerlogo from "../../assets/events/footerlogo.svg";
import gat from "../../assets/events/gatwhite.svg";
import bottomborder from "../../assets/events/bottomborder.svg";
import { birthdayData } from "../../store/atoms";
import { Chip, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Birthday = () => {
  const data = useRecoilValue(birthdayData);
  const [showMore, setShowMore] = useState(true);
  const [treeList, setTreeList] = useState(data.user_trees.slice(0, 8));
  const [index, setIndex] = useState(8);
  const navigate = useNavigate();
  const loadMore = () => {
    const newIndex = index + 8;
    const newShowMore = newIndex < 19;
    const newList = data.user_trees.slice(0, newIndex);
    setIndex(newIndex);
    setTreeList(newList);
    setShowMore(newShowMore);
  };

  const collapse = () => {
    setIndex(8);
    setTreeList(data.user_trees.slice(0, 8));
    setShowMore(true);
  };
  const classes = useStyles();
  let memories = [];
  for (const tree of data.user_trees) {
    memories.push.apply(memories, tree["memories"]);
  }

  memories = [...new Set(memories)];
  memories = memories.filter(function (e) {
    return e;
  });

  if ((memories.length === 1 && memories[0] === "") || memories.length === 0) {
    memories = [
      7, 6, 1, 3, 5, 4, 8, 9, 11, 12, 13, 14, 15, 23, 16, 17, 18, 19, 20, 21,
      22,
    ].map((number) => ({
      src: `https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory${number}.jpg`,
    }));
  } else {
    memories = memories.map((image) => ({
      src: image,
    }));
  }
  return (
    <>
      <div>
        <div style={{ minHeight: "100vh", zIndex: "-10" }}>
          <div
            style={{
              backgroundColor: "#664E2D",
              height: "100vh",
              zIndex: "-100",
              position: "relative",
            }}
          >
            <img src={logo} alt="logo" className={classes.imgLogo} />
            <img src={asset1} alt="asset1" className={classes.asset1} />
            <img src={asset2} alt="asset2" className={classes.asset2} />
            <div className={classes.hdrTxt}>
              A thicket of{" "}
              <span style={{ color: "#D2B68D", fontWeight: "bold" }}>
                {data.user_trees.length} tree
              </span>{" "}
              has been planted in the name of{" "}
              <span style={{ color: "#D2B68D", fontWeight: "bold" }}>
                {data.assigned_to[0].name}
              </span>{" "}
              on the occassion of their birthday
            </div>
            <div className={classes.donatedby}>
              <span>Donated by: {data.assigned_by.name}</span>
              <p style={{ marginTop: "0" }}>Date: {data.date.slice(0, 10)}</p>
            </div>
          </div>
        </div>
        <div className={classes.card}>
          <div className={classes.wish}>
            <p style={{ marginBottom: "8px", color: "#483924" }}>
              Wishing you a very
            </p>
            <p style={{ marginTop: "8px", color: "#D2B68D" }}>
              Happy Birthday!
            </p>
          </div>
          {data.user_trees[0].profile_image[0] !== "" && (
            <div style={{ width: "100%", textAlign: "center" }}>
              <img
                src={data.user_trees[0].profile_image[0]}
                alt="profile"
                className={classes.profile}
              />
            </div>
          )}
          <div className={classes.activity}>
            <p style={{ marginBottom: "8px", color: "#483924" }}>
              Some activites and memories from 14Trees
            </p>
            <div className={classes.imageC}>
              <Carousel
                hasMediaButton={false}
                hasIndexBoard={false}
                images={memories}
              />
            </div>
          </div>
          <div
            style={{
              padding: "5%",
              fontSize: "18px",
              fontWeight: "400",
              fontFamily: "Open Sans",
              lineHeight: "30px",
              textAlign: "center",
              paddingTop: "32px",
            }}
          >
            <span>
              Apart from reforestation on acquired barren land 14 Trees also
              partners with local village governments, forest department,
              farmers, schools etc to plant trees on their land increasing
              awareness to combat the effects of environmental degradation and
              climate change as well as support projects on habitat restoration,
              ground water recharging, biodiversity experiments and also provide
              livelihood for local tribal villagers.
            </span>
          </div>
        </div>
        <div style={{ paddingTop: "15vh", width: "100%" }}>
          <div style={{ position: "relative" }}>
            <img
              alt=""
              src={
                "https://14treesplants.s3.ap-south-1.amazonaws.com/gat/gat_703.jpg"
              }
              className={classes.plotimg}
            />
            <div className={classes.plotinfo}></div>
            <img src={gat} alt="gat" className={classes.gatLogo} />
            <p className={classes.gatheader}>
              Site of Plantation: {data.user_trees[0].tree.plot_id.name}
            </p>
            <div
              style={{
                position: "absolute",
                width: "100%",
                top: "60%",
                opacity: "1",
                color: "#ffffff",
                fontFamily: "Open Sans",
                fontSize: "22px",
              }}
            >
              <p className={classes.gatdesc}>
                This land is a portion of a very large tract of completely
                barren land on a hilltop in village Vetale near Pune. We are
                attempting to reforest the land and restore damaged ecology.
                Slowly and steadily, we are .
              </p>
            </div>
            <img src={asset4} alt="" className={classes.asset4} />
          </div>
        </div>
        <div
          style={{ width: "100%", textAlign: "center", position: "relative" }}
        >
          <img src={asset3} className={classes.cardasset} alt="" />
          <div
            style={{
              width: "130px",
              marginLeft: "auto",
              marginRight: "auto",
              paddingTop: "10vh",
            }}
          >
            <img src={trees} alt="tree" className={classes.treeicon} />
          </div>
          <div className={classes.treehdr}>The Trees Planted</div>
          <div className={classes.treeimgcontainer}>
            <Grid container spacing={3}>
              {treeList.map((tree, idx) => {
                return (
                  <Grid item xs={6} md={4}>
                    {tree.tree.image[0] === "" ? (
                      <img
                        src={tree.tree.tree_id.image[0]}
                        alt=""
                        className={classes.treeimg}
                        onClick={() =>
                          navigate(`/profile/${tree.tree.sapling_id}`)
                        }
                      />
                    ) : (
                      <img
                        src={tree.tree.image[0]}
                        alt=""
                        className={classes.treeimg}
                        onClick={() =>
                          navigate(`/profile/${tree.tree.sapling_id}`)
                        }
                      />
                    )}
                    <div
                      style={{
                        padding: "5px",
                        fontWeight: "400",
                        fontSize: "18px",
                      }}
                    >
                      Tree Name: {tree.tree.tree_id.name}
                    </div>
                    <div
                      style={{
                        padding: "5px",
                        fontWeight: "400",
                        fontSize: "18px",
                      }}
                    >
                      #{tree.tree.sapling_id}
                    </div>
                  </Grid>
                );
              })}
            </Grid>
            {showMore && (
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
            )}
          </div>
        </div>
        <div style={{ paddingTop: "10vh", width: "100%" }}>
          <img
            src={bottomborder}
            style={{ width: "100%", height: "auto" }}
            alt=""
          />
        </div>
        <div className={classes.footer}>
          <div
            style={{ width: "100%", marginLeft: "auto", textAlign: "center" }}
          >
            <img
              src={footerlogo}
              alt=""
              style={{ height: "auto", width: "136px", paddingTop: "16px" }}
            />
          </div>
          <p className={classes.companydesc}>14 Trees Foundation</p>
          <p
            style={{
              marginTop: "0px",
              width: "100%",
              textAlign: "center",
              fontSize: "18px",
              color: "#ffffff",
            }}
          >
            (A section 8 company)
          </p>
          <div className={classes.footthanks}>
            We welcome you to the 14Trees family!
          </div>
          <img src={footer} alt="" className={classes.footericon} />
        </div>
      </div>
    </>
  );
};

const useStyles = makeStyles((theme) =>
  createStyles({
    imgLogo: {
      position: "absolute",
      top: "10%",
      left: "7%",
      width: "80px",
      height: "110px",
    },
    asset1: {
      top: 0,
      right: 0,
      position: "absolute",
      height: "auto",
      width: "60vw",
      [theme.breakpoints.down("1200")]: {
        width: "80vw",
      },
    },
    asset2: {
      top: "49vh",
      right: 0,
      position: "absolute",
      height: "auto",
      width: "45vw",
      zIndex: "1",
      [theme.breakpoints.down("1200")]: {
        width: "60vw",
      },
      [theme.breakpoints.down("900")]: {
        width: "80vw",
        top: "80vh",
      },
    },
    hdrTxt: {
      position: "absolute",
      left: "7%",
      top: "35%",
      color: "#ffffff",
      fontSize: "47px",
      lineHeight: "66px",
      maxWidth: "50%",
      fontFamily: "Noto Serif JP",
      fontWeight: "500",
      zIndex: "20",
      [theme.breakpoints.down("1200")]: {
        maxWidth: "70%",
      },
      [theme.breakpoints.down("720")]: {
        maxWidth: "100%",
        fontSize: "32px",
        lineHeight: "45px",
        top: "35%",
      },
    },
    donatedby: {
      fontFamily: "Open Sans",
      fontSize: "30px",
      color: "#ffffff",
      lineHeight: "42px",
      position: "absolute",
      left: "7%",
      top: "70%",
      zIndex: "20",
      paddingTop: "8px",
      [theme.breakpoints.down("1200")]: {
        maxWidth: "70%",
      },
      [theme.breakpoints.down("900")]: {
        top: "80%",
      },
      [theme.breakpoints.down("600")]: {
        top: "80%",
        maxWidth: "90%",
        fontSize: "24px",
        lineHeight: "34px",
      },
    },
    card: {
      width: "75vw",
      minHeight: "100vh",
      marginLeft: "12vw",
      marginRight: "12vw",
      marginTop: "20vh",
      backgroundColor: "#ffffff",
      zIndex: "2",
      boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.14)",
      borderRadius: "35px",
      [theme.breakpoints.down("600")]: {
        width: "90vw",
        marginLeft: "5vw",
        marginRight: "5vw",
        marginTop: "15vh",
      },
    },
    wish: {
      fontSize: "50px",
      fontFamily: "Noto Serif JP",
      lineHeight: "72px",
      textAlign: "center",
      paddingTop: "32px",
      [theme.breakpoints.down("600")]: {
        fontSize: "32px",
        lineHeight: "48px",
      },
    },
    profile: {
      width: "40%",
      height: "auto",
      objectFit: "cover",
      borderRadius: "16px",
      [theme.breakpoints.down("600")]: {
        width: "80%",
        height: "auto",
      },
    },
    activity: {
      fontSize: "45px",
      fontFamily: "Noto Serif JP",
      lineHeight: "72px",
      textAlign: "center",
      paddingTop: "32px",
      [theme.breakpoints.down("600")]: {
        fontSize: "30px",
        lineHeight: "48px",
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
    plotimg: {
      width: "100%",
      height: "100vh",
      objectFit: "cover",
      filter: "grayscale(100%)",
    },
    gatLogo: {
      position: "absolute",
      left: "46%",
      width: "120px",
      height: "120px",
      opacity: "1",
      top: "25%",
      [theme.breakpoints.down("480")]: {
        left: "35%",
        top: "10%",
        height: "45vh",
      },
    },
    asset4: {
      width: "30vw",
      height: "auto",
      top: "-50vh",
      left: "0",
      position: "absolute",
      zIndex: "-1",
      [theme.breakpoints.down("480")]: {
        top: "-20vh",
        width: "50vw",
      },
    },
    gatheader: {
      position: "absolute",
      width: "100%",
      top: "45%",
      opacity: "1",
      color: "#ffffff",
      fontFamily: "Noto Serif JP",
      fontSize: "45px",
      textAlign: "center",
      [theme.breakpoints.down("480")]: {
        top: "35%",
        fontSize: "32px",
      },
    },
    gatdesc: {
      width: "60%",
      marginLeft: "auto",
      marginRight: "auto",
      textAlign: "center",
      marginTop: "0px",
      [theme.breakpoints.down("480")]: {
        width: "90%",
        fontSize: "18px",
        marginTop: "20px",
      },
    },
    plotinfo: {
      position: "absolute",
      background: "#664E2D",
      width: "100%",
      height: "100vh",
      top: 0,
      opacity: "0.5",
    },
    treeicon: {
      width: "120px",
      height: "120px",
    },
    cardasset: {
      position: "absolute",
      top: "0",
      right: "0",
      width: "40vw",
      height: "auto",
      [theme.breakpoints.down("480")]: {
        width: "60%",
        zIndex: "-2",
      },
    },
    treeimgcontainer: {
      width: "80%",
      marginLeft: "auto",
      marginRight: "auto",
      color: "#664E2D",
      [theme.breakpoints.down("480")]: {
        width: "90%",
      },
    },
    treeimg: {
      width: "100%",
      maxHeight: "350px",
      objectFit: "cover",
      borderRadius: "5px",
      cursor: "pointer",
      [theme.breakpoints.down("480")]: {
        maxHeight: "180px",
      },
    },
    treehdr: {
      color: "#664E2D",
      fontSize: "45px",
      fontFamily: "Noto Serif JP",
      marginBottom: "32px",
      [theme.breakpoints.down("480")]: {
        fontSize: "24px",
      },
    },
    footer: {
      backgroundColor: "#664E2D",
      marginTop: "-5px",
    },
    footthanks: {
      width: "80%",
      color: "#ffffff",
      fontSize: "40px",
      fontWeight: "24px",
      marginLeft: "auto",
      marginRight: "auto",
      textAlign: "center",
      fontFamily: "Noto Serif JP",
      paddingTop: "24px",
      paddingBottom: "40px",
      [theme.breakpoints.down("480")]: {
        fontSize: "32px",
      },
    },
    companydesc: {
      width: "100%",
      textAlign: "center",
      color: "#ffffff",
      fontSize: "24px",
      fontFamily: "Noto Serif JP",
      marginBottom: "5px",
      [theme.breakpoints.down("480")]: {
        fontSize: "18px",
      },
    },
    footericon: {
      height: "auto",
      width: "100%",
      objectFit: "cover",
      paddingTop: "32px",
    },
  })
);
