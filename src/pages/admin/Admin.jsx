import { useEffect, useCallback, useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { createStyles, makeStyles } from "@mui/styles";

import * as Axios from "../../api/local";
import { AdminLeftDrawer } from "./LeftDrawer";
import { Spinner } from "../../components/Spinner";
import { Box } from "@mui/material";
import { summary, adminNavIndex } from "../../store/adminAtoms";
import { AdminHome } from "./home/AdminHome";
import { Tree } from "./tree/Tree";
import { Forms } from "./Forms/Forms";
import { Users } from "./users/Users";
import logo from "../../assets/logo_white_small.png";

export const Admin = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const setSummary = useSetRecoilState(summary);
  const index = useRecoilValue(adminNavIndex);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let response = await Axios.default.get(`/analytics/summary`);
      if (response.status === 200) {
        setSummary(response.data);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }, [setSummary]);

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
