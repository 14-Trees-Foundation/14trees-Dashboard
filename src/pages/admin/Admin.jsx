import { useEffect } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import { AdminLeftDrawer } from "./LeftDrawer";

export const AdminLayout = () => {
  const classes = useStyles();

  useEffect(() => {
    document.title = "14Trees Admin";
    return () => {
      // Cleanup if needed
    };
  }, []);

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