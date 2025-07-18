import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { createStyles, makeStyles } from "@mui/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Backdrop from "@mui/material/Backdrop";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAuth } from "../auth/auth";
import Axios from "../../../api/local";
import bg from "../../../assets/bg.png";
import { Spinner } from "../../../components/Spinner";
import ApiClient from "../../../api/apiClient/apiClient";

export const Login = () => {
  let navigate = useNavigate();
  let location = useLocation();
  const [openBackdrop, setBackdropOpen] = React.useState(false);
  const [username, setUserName] = React.useState("");
  const [email, setEmail] = React.useState(null);
  const [phone, setPhone] = React.useState(null);
  let auth = useAuth();

  const classes = UseStyle();
  const paperStyle = {
    padding: 20,
    minHeight: "300px",
    width: 380,
    margin: "20px auto",
  };
  const avatarStyle = { backgroundColor: "#1bbd7e" };
  const textStyle = { margin: "8px auto" };
  const btnstyle = { margin: "8px 0" };

  let from = location.state?.from?.pathname + location.state?.from?.search || "/admin";

  const handlePostAuth = (user, token, tokenId, redirectPath = "/admin") => {
    let permissions = [];
    let roles = [];
    if (user.roles && (user.roles.includes("admin") || user.roles.includes("super-admin"))) {
      permissions = ["all"]
      roles = user.roles;
    }
    localStorage.setItem("permissions", JSON.stringify(permissions));
    localStorage.setItem("token", JSON.stringify(token));
    localStorage.setItem("roles", JSON.stringify(roles));
    auth.signin(
      user.name,
      user.email,
      user.id,
      permissions,
      roles,
      tokenId,
      () => {
        navigate(redirectPath, { replace: true });
      }
    );
  };

  // Handle URL parameters and token authentication
  React.useEffect(() => {
    const handleUrlParams = async () => {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('credential');
      const redirect = searchParams.get('redirect');

      if (token) {
        setBackdropOpen(true);
        try {
          const apiClient = new ApiClient();
          const res = await apiClient.authenticateToken(token);
          if (res.user && res.token) {
            localStorage.setItem("loginInfo", JSON.stringify({ token: res.token, expires_at: res.expires_at, name: res.user?.name }));
            handlePostAuth(res.user, res.token, token, redirect);
          } else {
            toast.error("User not authorized! Contact Admin");
          }
        } catch (error) {
          if (error.response?.status === 404) {
            toast.error("User not Found! Contact Admin");
          } else {
            toast.error("Authentication failed! Please try again.");
          }
        } finally {
          setBackdropOpen(false);
        }
      }
    };

    handleUrlParams();
  }, [location.search]);

  const responseGoogle = async (credentialResponse) => {
    // credentialResponse.credential is the JWT
    try {
      let res = await Axios.post(
        "/auth/google",
        JSON.stringify({
          token: credentialResponse.credential,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 201 && res.data.user.roles) {
        localStorage.setItem("loginInfo", JSON.stringify({ token: res.data.token, expires_at: res.data.expires_at, name: res.data.user?.name }));
        const user = res.data?.user;
        if (user?.roles && (user.roles?.includes("admin") || user.roles?.includes("super-admin"))) {
          from = "/admin"
        } else if (res.data.path && res.data.view_id) {
          from = res.data.path + "?v=" + res.data.view_id 
        } else {
          toast.error("User not authorized! Contact Admin");
          return;
        }
        handlePostAuth(res.data.user, res.data.token, credentialResponse.credential, from);
      } else {
        toast.error("User not authorized! Contact Admin");
      }
    } catch (error) {
      console.error(error)
      if (error.response && error.response.status === 404) {
        toast.error("User not Found! Contact Admin");
      } else {
        toast.error("Google authentication failed!");
      }
    }
  };

  const handleValueChange = (value, type) => {
    if (type === "name") {
      setUserName(value);
    } else if (type === "email") {
      setEmail(value?.trim());
    } else if (type === "phone") {
      setPhone(value);
    }
  };

  const validate = () => {
    if (username === "" || email === null || phone === null) {
      return true;
    }
    return false;
  };

  const handleSubmit = async () => {
    try {
      if (validate()) {
        toast.error("Please fill mandatory fields", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        setBackdropOpen(true);
        const params = JSON.stringify({
          name: username,
          email: email,
          phone: phone,
        });

        try {
          let res = await Axios.post("/admin/users", params, {
            headers: {
              "Content-type": "application/json",
            },
          });
          if (res.status === 201) {
            setBackdropOpen(false);
            toast.success("Data uploaded successfully!");
          }
        } catch (error) {
          if (error.response.status === 500 || error.response.status === 409) {
            setBackdropOpen(false);
            toast.error(error.response.data.error);
          } else if (error.response.status === 400) {
            setBackdropOpen(false);
            toast.error("User already Registered!");
          }
        }
      }
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_CLIENT_ID}>
      <div className={classes.box}>
        <img
          alt="bg"
          src={bg}
          className={classes.bg}
          style={{ height: "100vh" }}
        />
        <div className={classes.overlay} style={{ height: "100vh" }}>
          <Backdrop className={classes.backdrop} open={openBackdrop}>
            <Spinner text={"Logging you in..."} />
          </Backdrop>
          <ToastContainer />
          <Grid style={{ marginTop: "10%" }}>
            <Paper elevation={10} style={paperStyle}>
              <Grid align="center">
                <Avatar style={avatarStyle}>
                  <LockOutlinedIcon />
                </Avatar>
                <h2>Sign Up</h2>
              </Grid>
              <TextField
                style={textStyle}
                label="Name"
                placeholder="Enter Name"
                fullWidth
                required
                onChange={(e) => handleValueChange(e.target.value, "name")}
              />
              <TextField
                style={textStyle}
                label="Email ID"
                placeholder="Enter email ID"
                fullWidth
                required
                onChange={(e) => handleValueChange(e.target.value, "email")}
              />
              <TextField
                style={textStyle}
                label="Contact"
                placeholder="Enter Phone"
                fullWidth
                required
                onChange={(e) => handleValueChange(e.target.value, "phone")}
              />
              <Button
                type="submit"
                color="primary"
                variant="contained"
                style={btnstyle}
                fullWidth
                onClick={handleSubmit}
              >
                Sign Up
              </Button>
              <div
                style={{ width: "100%", textAlign: "center", paddingTop: "24px" }}
              >
                <GoogleLogin
                  onSuccess={responseGoogle}
                  onError={() => toast.error("Google login failed!")}
                  useOneTap
                />
              </div>
            </Paper>
          </Grid>
        </div>
      </div>
    </GoogleOAuthProvider>
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
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
    },
  })
);
