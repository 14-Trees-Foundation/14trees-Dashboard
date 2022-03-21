import { useEffect, useCallback, useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { createStyles, makeStyles } from "@mui/styles";

import * as Axios from "../../api/local";
import { AdminLeftDrawer } from "./LeftDrawer";
import { Spinner } from "../../components/Spinner";
import { Box } from "@mui/material";
import { summary, adminNavIndex,treeLoggedByDate } from "../../store/adminAtoms";
import { AdminHome } from "./home/AdminHome";
import { Tree } from "./tree/Tree";
import { Forms } from "./Forms/Forms";
import { Users } from "./users/Users";
import logo from "../../assets/logo_white_small.png";
import { useNavigate } from "react-router-dom";

export const Admin = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const setSummary = useSetRecoilState(summary);
  const setTreeLoggedByDate = useSetRecoilState(treeLoggedByDate);
  const index = useRecoilValue(adminNavIndex);
  const token = JSON.parse(localStorage.getItem('token'));
  const navigate = useNavigate()

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let response = await Axios.default.get(`/analytics/summary`, {
        headers: {
          "x-access-token": token,
          "content-type": "application/json"
      }
      });
      if (response.status === 200) {
        setSummary(response.data);
      }
      response = await Axios.default.get(`/trees/loggedbydate`);
      if (response.status === 200) {
        response.data.forEach((element, index) => {
          element["_id"] = element["_id"].substring(0, 10);
        });
        setTreeLoggedByDate(response.data);
      }
    } catch (error) {
      if(error.response.status === 500) {
        navigate('/login')
      }
    }

    setLoading(false);
  }, [setSummary, navigate, setTreeLoggedByDate, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const pages = [
    {
      page: AdminHome,
      displayName: "Home",
      logo: logo,
    },
    {
      page: Tree,
      displayName: "Tree",
      logo: logo,
    },
    {
      page: Forms,
      displayName: "Forms",
      logo: logo,
    },
    {
      page: Users,
      displayName: "Users",
      logo: logo,
    },
  ];
  const mainBox = () => {
    const Page = pages[index].page;
    return (
      <div className={classes.outlet}>
        <Page />
      </div>
    );
  };

  if (loading) {
    return <Spinner />;
  } else {
    return (
      <div className={classes.box}>
        {/* <img alt="bg" src={bg} className={classes.bg} style={{height: '100vh'}}/> */}
        <Box sx={{ display: "flex" }}>
          <AdminLeftDrawer />
          <Box component="main" sx={{ minWidth: "900px", p: 2, width: "100%" }}>
            {mainBox()}
          </Box>
        </Box>
      </div>
    );
  }
};

const useStyles = makeStyles((theme) =>
  createStyles({
    box: {
      overflow: "auto",
      width: "100%",
      position: "relative",
      backgroundColor: "#B1BFB5",
      minHeight: "100vh",
      heigth: "100%",
    },
    bg: {
      width: "100%",
      objectFit: "cover",
    },
    outlet: {
      [theme.breakpoints.down("768")]: {
        marginTop: "48px",
      },
    },
  })
);
