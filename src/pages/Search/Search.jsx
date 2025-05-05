import React, { useEffect, useState } from "react";
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

import image1 from '../../assets/home/corporate-gifts.jpeg'
import image2 from '../../assets/home/personal-gifts.jpeg'
import image3 from '../../assets/home/grove-gifts.jpeg'
import { Button, Typography } from "@mui/material";
import ChatBot from "../../components/Chatbot/ChatBot";
import ChatbotV2 from "../../components/Chatbot/ChatBotV2";
import { UserRoles } from "../../types/common";

export const Search = () => {
  const classes = UseStyle();
  const navigate = useNavigate();
  let results = useRecoilValue(searchResults);
  const [key, setKey] = useState('');
  const setSearchResult = useSetRecoilState(searchResults);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState(['']);

  useEffect(() => {
    const roles = localStorage.getItem("roles");
    try {
      const rolesArr = JSON.parse(roles);
      setRoles(rolesArr);
    } catch (error) {

    }
  }, [])

  const handleSearch = (value) => {
    setKey(value);
    fetchData(value);
  };
  let selectedChips = "All";

  const fetchData = async (searchKey) => {
    if (searchKey.trim().length === 0) return;
    let params = {
      key: searchKey.trim(),
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
          {roles.includes(UserRoles.SuperAdmin) && <ChatbotV2 />}
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
              <h1 className={classes.cardheader} style={{ marginBottom: '20px', alignSelf: 'center' }}>Brighten someone's day</h1>
              <div className={classes.cardContainer}>
                <Card
                  className={classes.primaryCard}
                  cover={
                    <img
                      alt="example"
                      src={image1}
                      style={{ padding: '10px', width: 'calc(100% - 20px)' }}
                    />
                  }
                  actions={[
                    <Button 
                      variant="contained" color="success" style={{ textTransform: 'none' }}
                      onClick={() => { window.open("https://forms.gle/drNLNzYandSzer1TA"); }}
                    >
                      Gift Trees
                    </Button>
                  ]}
                  title="Corporate Gifting"
                >
                  <ul style={{ flexGrow: 1 }}>
                    <li>Conference Gift</li>
                    <li>Annual day Celebration</li>
                    <li>Customer Engagement</li>
                    <li>Retirement Gift</li>
                    <li>Birthday Gift</li>
                    <li>Festive Gifting</li>
                  </ul>
                </Card>
                <Card
                  className={classes.primaryCard}
                  cover={
                    <img
                      alt="example"
                      src={image2}
                      style={{ padding: '10px', height: '197px', width: 'calc(100% - 20px)' }}
                    />
                  }
                  actions={[
                    <Button 
                      variant="contained" color="success" style={{ textTransform: 'none' }}
                      onClick={() => { window.open("https://forms.gle/fyuHye7yQaDTRGku7"); }}
                    >
                      Gift Trees
                    </Button>
                  ]}
                  title="Personal Gifts"
                >
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
                  className={classes.primaryCard}
                  cover={
                    <img
                      alt="example"
                      src={image3}
                      style={{ padding: '10px', height: '197px', width: 'calc(100% - 20px)' }}
                    />
                  }
                  actions={[
                    <Button 
                      variant="contained" color="success" style={{ textTransform: 'none' }}
                      onClick={() => { window.open("https://forms.gle/drNLNzYandSzer1TA"); }}
                    >
                      Create Forest
                    </Button>
                  ]}
                  title="Social Groves"
                >
                  <ul>
                    <li>Alumni/College Grove</li>
                    <li>School Grove</li>
                    <li>Event/Ocassion Grove</li>
                    <li>Club Grove</li>
                    <li>Family Grove</li>
                    <li>Memorial Grove</li>
                  </ul>
                </Card>
              </div>
              <h1 className={classes.cardheader} style={{ marginTop: '100px', marginBottom: '20px', textAlign: 'center' }}>Other ways to take climate action</h1>
              <div className={classes.cardContainer}>
              <Card
                  hoverable
                  className={classes.secondaryCard}
                  onClick={() => { window.open("https://tinyurl.com/14T-volunteers-poll"); }}
                >
                  <Meta
                    title="Volunteer your time"
                    className={classes.meta}
                  />
                </Card>
                <Card
                  hoverable
                  className={classes.secondaryCard}
                  onClick={() => { window.open("https://tinyurl.com/14Trees-req-visit"); }}
                >
                  <Meta
                    title="Invite potential contributors for a site visit"
                    className={classes.meta}
                  />
                </Card>
                <Card
                  hoverable
                  className={classes.secondaryCard}
                >
                  <Meta
                    title="Host 14 Trees outreach event in your professional and/or social group"
                    className={classes.meta}
                  />
                </Card>
              </div>
              <h2 className={classes.cardheader} style={{ marginTop: '50px', alignSelf: 'center', fontSize: "24px", }}>Share your site visit testimonial, feedback, actionable ideas</h2>
              <div className={classes.cardContainer} style={{ marginBottom: '30px' }}>
                <Button variant="contained" onClick={() => { window.open("https://forms.gle/sWXxRZb1NKm9wWD18"); }}>
                  Contact Us
                </Button>
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
        marginTop: "30%",
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
      marginTop: "50px",
    },
    cardContainer: {
      display: "flex",
      justifyContent: "center",
      flexWrap: 'wrap',
    },
    primaryCard: {
      margin: '10px',
      width: '300px',
      border: 'none',
      overflow: 'hidden',
      // borderRadius: '20px',
      backgroundColor: 'rgb(190 210 195)',
      transition: 'background-color 0.3s',
      '&:hover': {
        boxShadow: '0 4px 8px rgba(255, 255, 255, 0.8)',
        backgroundColor: "rgb(202, 225, 209)",
        transition: "background-color 0.3s ease",
      },
      '& .ant-card-head-title': {
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        textAlign: 'center',
      },
      '& .ant-card-body': {
        padding: '10px'
      },
    },
    secondaryCard: {
      margin: '10px',
      width: '250px',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
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
    meta: {
      alignItems: 'center',
      '& .ant-card-meta-title': {
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        textAlign: 'center',
      },
    },
    cardimage: {
      padding: '10px',
      width: 'calc(100% - 20px) !important',
      height: 'auto',
      objectFit: 'cover',
      margin: '10px',
    },
    cardheader: {
      fontSize: "42px",
      color: "#9BC53D",
      fontWeight: "bold",
      [theme.breakpoints.down("md")]: {
        fontSize: "32px",
      },
    },
  })
);
