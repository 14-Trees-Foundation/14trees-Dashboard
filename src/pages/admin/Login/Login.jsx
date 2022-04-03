import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { createStyles, makeStyles } from "@mui/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { GoogleLogin } from "react-google-login";
import Backdrop from "@mui/material/Backdrop";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAuth } from "../auth/auth";
import Axios from "../../../api/local";
import bg from "../../../assets/bg.png";
import { Spinner } from "../../../components/Spinner";

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

  let from = location.state?.from?.pathname || "/admin";

  const responseGoogle = async (response) => {
    try {
      let res = await Axios.post(
        "/auth/google",
        JSON.stringify({
          token: response.tokenId,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 201 && res.data.user.role) {
        localStorage.setItem("loginInfo", JSON.stringify(response));
        localStorage.setItem(
          "permissions",
          JSON.stringify(res.data.user.permissions)
        );
        localStorage.setItem("token", JSON.stringify(res.data.token));
        auth.signin(
          res.data.user.name,
          res.data.user.permissions,
          response.tokenId,
          () => {
            navigate(from, { replace: true });
          }
        );
      }
      toast.error("User not authorized! Contact Admin");
    } catch (error) {
      if (error.response.status === 404) {
        toast.error("User not Found! Contact Admin");
      }
    }
  };

  const handleValueChange = (value, type) => {
    if (type === "name") {
      setUserName(value);
    } else if (type === "email") {
      setEmail(value);
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
                clientId={process.env.REACT_APP_CLIENT_ID}
                buttonText="Log in with Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={"single_host_origin"}
              />
            </div>
            {/* <div style={{width: '100%', textAlign:'center', paddingTop: '24px'}}>
                            <GoogleLogout
                                clientId={process.env.REACT_APP_CLIENT_ID}
                                buttonText="Log out"
                                onLogoutSuccess={onLogoutSuccess}
                            />
                        </div> */}
          </Paper>
        </Grid>
      </div>
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
