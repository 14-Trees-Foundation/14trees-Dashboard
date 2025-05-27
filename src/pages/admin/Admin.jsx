import { useEffect, useCallback, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { createStyles, makeStyles } from "@mui/styles";
import { useNavigate, Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import * as Axios from "../../api/local";
import { AdminLeftDrawer } from "./LeftDrawer";
import { Spinner } from "../../components/Spinner";
import {
  summary,
  treeLoggedByDate,
  plotsList,
} from "../../store/adminAtoms";

export const AdminLayout = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const summaryData = useRecoilValue(summary);
  const setSummary = useSetRecoilState(summary);
  const setTreeLoggedByDate = useSetRecoilState(treeLoggedByDate);
  const setPlotsList = useSetRecoilState(plotsList);
  const token = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {

    if (summaryData && Object.keys(summaryData).length !== 0) return;

    setLoading(true);
    try {
      // Fetch summary data
      const summaryResponse = await Axios.default.get(`/analytics/summary`, {
        headers: {
          "x-access-token": token,
          "content-type": "application/json",
        },
      });
      if (summaryResponse.status === 200) {
        setSummary(summaryResponse.data);
      }

      // Fetch tree data
      const treesResponse = await Axios.default.get(`/trees/loggedbydate`);
      if (treesResponse.status === 200) {
        const formattedData = treesResponse.data.map(element => ({
          ...element,
          _id: element._id.substring(0, 10)
        }));
        setTreeLoggedByDate(formattedData);
      }

    
      // const plotRes = await Axios.default.get(`/plots`);
      // if (plotRes.status === 200) {
      //   setPlotsList(plotRes.data.result);
      // }
    } catch (error) {
      if (error.response?.status === 500) {
        navigate("/login");
      }
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  }, [setSummary, navigate, setTreeLoggedByDate, setPlotsList, token]);

  useEffect(() => {
    fetchData();
    document.title = "14Trees Admin";
    return () => {
      // Cleanup if needed
    };
  }, [fetchData]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={classes.box}>
      <Box sx={{ display: "flex" }}>
        <AdminLeftDrawer />
        <Box 
          component="main" 
          sx={{ 
            minWidth: "1080px", 
            p: 2, 
            width: "100%",
            minHeight: "calc(100vh - 64px)"
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </div>
  );
};

const useStyles = makeStyles((theme) =>
  createStyles({
    box: {
      overflow: "auto",
      width: "100%",
      position: "relative",
      backgroundColor: "#B1BFB5",
      minHeight: "100vh",
      height: "100%",
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

export default AdminLayout;