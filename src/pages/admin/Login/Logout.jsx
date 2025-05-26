import * as React from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { createStyles, makeStyles } from "@mui/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { GoogleLogout } from "react-google-login";
import Backdrop from "@mui/material/Backdrop";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAuth } from "../auth/auth";
import { Spinner } from "../../../components/Spinner";

export const Logout = () => {
  let navigate = useNavigate();
  const [openBackdrop, setBackdropOpen] = React.useState(false);
  const auth = useAuth();

  const classes = UseStyle();
  const paperStyle = {
    padding: 20,
    minHeight: "250px",
    width: 350,
    margin: "20px auto",
  };
  const avatarStyle = { backgroundColor: "#bd1b1b" }; // Red color for logout
  const btnstyle = { margin: "8px 0" };

  const handleLogout = async () => {
    setBackdropOpen(true);
    try {
      // Simulate API call or cleanup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear local storage
      localStorage.removeItem("loginInfo");
      localStorage.removeItem("permissions");
      localStorage.removeItem("token");
      localStorage.removeItem("roles");
      
      // Sign out using auth context
      auth.signout(() => {
        setBackdropOpen(false);
        toast.success("Logged out successfully!");
        navigate("/login", { replace: true });
      });
    } catch (error) {
      setBackdropOpen(false);
      toast.error("Error during logout");
    }
  };

  const onLogoutSuccess = () => {
    toast.info("Google session ended");
    handleLogout();
  };

  return (
    <div className={classes.box}>
      <Backdrop className={classes.backdrop} open={openBackdrop}>
        <Spinner text={"Logging you out..."} />
      </Backdrop>
      <ToastContainer />
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "100vh" }}>
        <Paper elevation={10} style={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}>
              <LockOutlinedIcon />
            </Avatar>
            <h2>Sign Out</h2>
            <p>Are you sure you want to log out?</p>
          </Grid>
          <Button
            type="button"
            color="secondary"
            variant="contained"
            style={btnstyle}
            fullWidth
            onClick={handleLogout}
          >
            Log Out
          </Button>
          <div style={{ width: "100%", textAlign: "center", paddingTop: "24px" }}>
            <GoogleLogout
              clientId={import.meta.env.VITE_APP_CLIENT_ID}
              buttonText="Log out of Google"
              onLogoutSuccess={onLogoutSuccess}
            />
          </div>
        </Paper>
      </Grid>
    </div>
  );
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
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
    },
  })
);