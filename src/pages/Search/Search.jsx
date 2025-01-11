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
          <img
            alt="bg"
            src={bg}
            className={classes.bg}
            style={{ height: "100vh" }}
          />
          <div className={classes.overlay} style={{ height: "100vh" }}>
            <AppBar />
            <div className={classes.main}>
              <div className={classes.header}>
                <h1 className={classes.infoheader}>100+</h1>
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
                <h1 className={classes.infoheader}>100+</h1>
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
      overflow: "auto",
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
  })
);
