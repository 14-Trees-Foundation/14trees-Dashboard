import React, { useState } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import { useRecoilValue } from "recoil";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import { AppBar } from "../../components/Appbar";
import { Spinner } from "../../components/Spinner";
import { UserList } from "../../stories/UserList/UserList";
import bg from "../../assets/bg.png";
import { searchResults } from "../../store/atoms";
import { SearchBar } from "../../components/Searchbar";
import { useSetRecoilState } from "recoil";
import api from "../../api/local";
import { Card } from "antd";
import Meta from "antd/es/card/Meta";

import image1 from '../../assets/home/land-1.jpg'
import image2 from '../../assets/home/land-2.jpg'
import image3 from '../../assets/home/land-3.jpg'
import image4 from '../../assets/home/land-4.jpg'
import image5 from '../../assets/home/land-5.jpg'
import image6 from '../../assets/home/land-6.jpg'
import image7 from '../../assets/home/land-7.jpg'
import { Divider } from "@mui/material";

export const Search = () => {
  const classes = UseStyle();
  const navigate = useNavigate();
  let results = useRecoilValue(searchResults);
  const [key, setKey] = useState('');
  const setSearchResult = useSetRecoilState(searchResults);
  const [loading, setLoading] = useState(false);

  const handleSearch = (value) => {
    setKey(value);
    fetchData(value);
  };
  let selectedChips = "All";

  const fetchData = async (searchKey) => {
    if (searchKey.length === 0) return;
    let params = {
      key: searchKey,
    };
    setLoading(true);

    try {
      const res = await api.get("/search/", {
        params: params,
      });

      if (res.status === 200) {
        setSearchResult(res.data);
      } else {
        toast.error(res.data?.message ?? "Something went wrong");
      }
    } catch (e) {
      toast.error("Something went wrong. Please try again later!");
    }

    setLoading(false);
  };

  const onUserClick = async (value) => {
    navigate("/profile/" + value.sapling_id);
  };

  if (loading) {
    return <Spinner />;
  } else {
    if (Object.keys(results.users).length === 0 && key === "") {
      return (
        <div className={classes.box}>
          <img
            alt="bg"
            src={bg}
            className={classes.bg}
            style={{ height: "100vh" }}
          />
          <div className={classes.overlay} style={{ height: "auto" }}>
            <AppBar />
            <div className={classes.main}>
              <div className={classes.header}>
                <h1 className={classes.infoheader}>200+</h1>
                <p className={classes.infodesc}>
                  People employed from local community
                </p>
              </div>
              <div>
                <div className={classes.inputBox}>
                  <SearchBar searchSubmit={handleSearch} />
                </div>
              </div>
            </div>
            <div className={classes.bottomContainer}>
              <div className={classes.cardContainer}>
                <Card
                  hoverable
                  className={classes.primaryCard}
                  onClick={() => { window.open("https://docs.google.com/forms/d/e/1FAIpQLSfumyti7x9f26BPvUb0FDYzI2nnuEl5HA63EO8svO3DG2plXg/viewform"); }}
                  cover={
                    <img
                      alt="example"
                      src={image1}
                      height={"160px"}
                    />
                  }
                >
                  <Meta
                    title="Corporate Gifting"
                  />
                  <ul>
                    <li>Conference Gift</li>
                    <li>Annual day Celebration</li>
                    <li>Customer Engagement</li>
                    <li>Retirement Gift</li>
                    <li>Birthday Gift</li>
                    <li>Festive Gifting</li>
                  </ul>
                </Card>
                <Card
                  hoverable
                  className={classes.primaryCard}
                  onClick={() => { window.open("https://docs.google.com/forms/d/e/1FAIpQLSfumyti7x9f26BPvUb0FDYzI2nnuEl5HA63EO8svO3DG2plXg/viewform"); }}
                  cover={
                    <img
                      alt="example"
                      src={image2}
                      height={"160px"}
                    />
                  }
                >
                  <Meta
                    title="Personal Gifts"
                  />
                  <ul>
                    <li>Birthday Gift</li>
                    <li>Wedding Gift</li>
                    <li>Memorial</li>
                    <li>Anniversary Gift</li>
                    <li>Return Gifts</li>
                    <li>Festive Greeting</li>
                  </ul>
                </Card>
                <Card
                  hoverable
                  className={classes.primaryCard}
                  onClick={() => { window.open("https://docs.google.com/forms/d/e/1FAIpQLSfumyti7x9f26BPvUb0FDYzI2nnuEl5HA63EO8svO3DG2plXg/viewform"); }}
                  cover={
                    <img
                      alt="example"
                      src={image3}
                      height={"160px"}
                    />
                  }
                >
                  <Meta
                    title="Social Groves"
                  />
                  <ul>
                    <li>Alumni/College Grove</li>
                    <li>School Grove</li>
                    <li>Corporate Grove</li>
                    <li>Club Grove</li>
                  </ul>
                </Card>
                <Card
                  hoverable
                  className={classes.primaryCard}
                  onClick={() => { window.open("https://docs.google.com/forms/d/e/1FAIpQLSfumyti7x9f26BPvUb0FDYzI2nnuEl5HA63EO8svO3DG2plXg/viewform"); }}
                  cover={
                    <img
                      alt="example"
                      src={image4}
                      height={"160px"}
                    />
                  }
                >
                  <Meta
                    title="Personal Groves"
                  />
                  <ul>
                    <li>My 14 Trees</li>
                    <li>Family Grove</li>
                    <li>Memorial Grove</li>
                    <li>Visitor Grove</li>
                  </ul>
                </Card>
              </div>
              <Divider sx={{ backgroundColor: 'white', width: '80%', marginTop: '20px' }} />
              <div className={classes.cardContainer}>
                <Card
                  hoverable
                  className={classes.secondaryCard}
                // cover={
                //   <img
                //     alt="example"
                //     src={image5}
                //   />
                // }
                >
                  <Meta
                    title="Volunteer My Time"
                    className={classes.meta}
                  />
                </Card>
                <Card
                  hoverable
                  className={classes.secondaryCard}
                // cover={
                //   <img
                //     alt="example"
                //     src={image6}
                //   />
                // }
                >
                  <Meta
                    title="Spread 14Trees Message"
                    className={classes.meta}
                  />
                </Card>
                <Card
                  hoverable
                  className={classes.secondaryCard}
                // cover={
                //   <img
                //     alt="example"
                //     src={image7}
                //   />
                // }
                >
                  <Meta
                    title="Request a Site Visit"
                    className={classes.meta}
                  />
                </Card>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={classes.box}>
          <AppBar />
          <ToastContainer />
          <img
            alt="bg"
            src={bg}
            className={classes.bg}
            style={{ height: "40vh" }}
          />
          <div className={classes.overlay} style={{ height: "40vh" }}>
            <div className={classes.main} style={{ paddingTop: "4%" }}>
              <div className={classes.header} style={{ marginTop: "0" }}>
                <h1 className={classes.infoheader}>200+</h1>
                <p className={classes.infodesc}>
                  People employed from local community
                </p>
              </div>
              <div>
                <div className={classes.inputBox}>
                  <SearchBar searchSubmit={handleSearch} />
                </div>
              </div>
            </div>
            <div className={classes.result}>
              {results.total_results === 0 ? (
                <div className={classes.resultsH}>
                  0 Results Found for : {key}
                </div>
              ) : (
                <div className={classes.resultsH}>
                  Search Results for: {key}
                </div>
              )}
              {(selectedChips === "Individual" || selectedChips === "All") && (
                <div>
                  <UserList />
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
  }
};

const UseStyle = makeStyles((theme) =>
  createStyles({
    box: {
      width: "100%",
      position: "relative",
      backgroundColor: "#e5e5e5",
      minHeight: "100vh",
    },
    bg: {
      width: "100%",
      objectFit: "cover",
    },
    overlay: {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      background:
        "linear-gradient(358.58deg, #1F3625 37.04%, rgba(31, 54, 37, 0.636721) 104.2%, rgba(31, 54, 37, 0) 140.95%)",
    },
    main: {
      width: "65vw",
      paddingLeft: "18vw",
      marginTop: "5%",
      position: "relative",
      [theme.breakpoints.down("748")]: {
        width: "80vw",
        paddingLeft: "9vw",
        marginTop: "20%",
      },
    },
    header: {
      marginTop: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    infoheader: {
      fontSize: "80px",
      color: "#9BC53D",
      fontWeight: "550",
      [theme.breakpoints.down("md")]: {
        fontSize: "50px",
      },
    },
    infodesc: {
      fontSize: "24px",
      paddingLeft: "2%",
      color: "#ffffff",
      fontWeight: "500",
      alignItems: "center",
      textAlign: "center",
      // lineHeight: '80px',
      [theme.breakpoints.down("md")]: {
        fontSize: "15px",
      },
    },
    infobox: {
      marginTop: "50px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      [theme.breakpoints.down("md")]: {
        flexWrap: "wrap",
      },
    },
    inputBox: {
      width: "65vw",
      backgroundColor: "#ffffff",
      borderRadius: "7px",
      alignItems: "center",
      paddingTop: "2%",
      paddingBottom: "2%",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.16), 0 4px 8px rgba(0, 0, 0, 0.23)",
      [theme.breakpoints.down("748")]: {
        width: "80vw",
      },
    },
    sep: {
      color: "#ffffff",
      justifyContent: "center",
      display: "flex",
      paddingTop: "3%",
      paddingBottom: "3%",
    },
    btnGrp: {
      display: "flex",
      justifyContent: "space-around",
      flexWrap: "wrap",
    },
    individual: {
      marginTop: "10px",
    },
    resultsH: {
      fontSize: "16px",
      fontWeight: "400",
      height: "36px",
      paddingTop: "8px",
      paddingLeft: "5px",
      [theme.breakpoints.down("480")]: {
        paddingTop: "4%",
        paddingLeft: "4%",
      },
    },
    result: {
      marginTop: "2%",
      width: "65vw",
      marginLeft: "18vw",
      backgroundColor: "#e5e5e5",
      borderRadius: "10px",
      [theme.breakpoints.down("480")]: {
        width: "90vw",
        marginLeft: "5vw",
      },
    },
    bottomContainer: {
      display: "flex",
      flexDirection: 'column',
      alignItems: "center",
    },
    cardContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: "50px",
      flexWrap: 'wrap',
    },
    primaryCard: {
      margin: '10px',
      width: '300px',
      border: 'none',
      overflow: 'hidden',
      borderRadius: '20px',
      backgroundColor: 'rgb(190 210 195)',
      transition: 'background-color 0.3s',
      '&:hover': {
        boxShadow: '0 4px 8px rgba(255, 255, 255, 0.8)',
        backgroundColor: "rgb(202, 225, 209)",
        transition: "background-color 0.3s ease",
      },
    },
    secondaryCard: {
      margin: '10px',
      width: '250px',
      border: 'none',
      overflow: 'hidden',
      borderRadius: '20px',
      backgroundColor: 'rgb(190 210 195)',
      transition: 'background-color 0.3s',
      '&:hover': {
        boxShadow: '0 4px 8px rgba(255, 255, 255, 0.8)',
        backgroundColor: "rgb(202, 225, 209)",
        transition: "background-color 0.3s ease",
      },
      meta: {
        '& .ant-card-meta-title': {
          whiteSpace: 'normal',
          wordWrap: 'break-word',
        },
      },
    }
  })
);
