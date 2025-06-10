import * as React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  Avatar,
  Typography,
  useTheme,
  useMediaQuery,
  Backdrop,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { GoogleLogin } from "react-google-login";
import { ToastContainer, toast } from "react-toastify";
import { makeStyles } from "@mui/styles";

import Axios from "../../../api/local";
import { useAuth } from "../auth/auth";
import { Spinner } from "../../../components/Spinner";
import bg from "../../../assets/bg.png";
import { AutocompleteWithPagination } from "../../../components/AutoComplete";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as groupActionCreators from "../../../redux/actions/groupActions";
import { Group } from "../../../types/Group";

export const CorporateLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openBackdrop, setBackdropOpen] = useState(false);
  const [groupPage, setGroupPage] = useState(0);
  const [groupNameInput, setGroupNameInput] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const classes = UseStyle(theme);

  const auth = useAuth();
  const dispatch = useAppDispatch();
  const { getGroups } = bindActionCreators(groupActionCreators, dispatch);
  const groupData = useAppSelector((state) => state.groupsData);

  let groupsList: Group[] = [];
  if (groupData) {
    groupsList = Object.values(groupData.groups).sort((a, b) => b.id - a.id);
  }

  const from = (location.state as any)?.from?.pathname || "/admin";

  useEffect(() => {
    const handler = setTimeout(() => getGroupsData(), 300);
    return () => clearTimeout(handler);
  }, [groupPage, groupNameInput]);

  const getGroupsData = async () => {
    const filters = [
      { columnField: "name", value: groupNameInput, operatorValue: "contains" },
    ];
    getGroups(groupPage * 10, 10, filters);
  };

  const responseGoogle = async (response: any) => {
    try {
      setBackdropOpen(true);
      const googleRes = await Axios.post(
        "/auth/google",
        JSON.stringify({ token: response.tokenId }),
        { headers: { "Content-Type": "application/json" } }
      );

      const user = googleRes.data.user;
      const token = googleRes.data.token;

      if (!user || !user.roles) {
        toast.error("User not authorized! Contact Admin");
        setBackdropOpen(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("loginInfo", JSON.stringify(response));
      localStorage.setItem("roles", JSON.stringify(user.roles));

      const permissions = user.roles.includes("admin") ? ["all"] : [];
      localStorage.setItem("permissions", JSON.stringify(permissions));

      const accessRes = await Axios.post(
        "/auth/verify-access",
        {
          user_id: user.id,
          path: window.location.pathname,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (accessRes.data.code !== 200) {
        toast.error(accessRes.data.message || "Access denied");
        setBackdropOpen(false);
        return;
      }

      auth.signin(
        user.name,
        user.id,
        permissions,
        user.roles,
        response.tokenId,
        () => navigate(from, { replace: true })
      );
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Login failed. Contact Admin.");
    } finally {
      setBackdropOpen(false);
    }
  };

  return (
    <div className={classes.box}>
      <img alt="bg" src={bg} className={classes.bg} />
      <div className={classes.overlay}>
        <Backdrop className={classes.backdrop} open={openBackdrop}>
          <Spinner text={"Logging you in..."} />
        </Backdrop>
        <ToastContainer />

        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "100vh" }}>
          <Grid item>
            <Paper
              elevation={10}
              sx={{
                width: 380,
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2.5,
              }}
            >
              <Avatar sx={{ backgroundColor: "#1bbd7e" }}>
                <LockOutlinedIcon />
              </Avatar>

              <Typography variant="h5">
                Login
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <AutocompleteWithPagination
                  label="Select your corporate"
                  options={groupsList}
                  getOptionLabel={(option: Group) => option?.name || ""}
                  onChange={(event: any, newValue: Group | null) => setSelectedGroup(newValue)}
                  onInputChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    setGroupPage(0);
                    setGroupNameInput(event.target.value);
                  }}
                  setPage={setGroupPage}
                  size="small"
                  value={selectedGroup}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <GoogleLogin
                  clientId={import.meta.env.VITE_APP_CLIENT_ID}
                  buttonText="Log in with Google"
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={"single_host_origin"}
                />
              </Box>
            </Paper>

          </Grid>
        </Grid>
      </div>
    </div>
  );
};

const UseStyle = makeStyles((theme: any) => ({
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
    height: "100vh",
  },
  overlay: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100vh",
    background:
      "linear-gradient(358.58deg, #1F3625 37.04%, rgba(31, 54, 37, 0.636721) 104.2%, rgba(31, 54, 37, 0) 140.95%)",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));