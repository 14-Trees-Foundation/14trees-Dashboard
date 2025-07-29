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
import { Spinner } from "../../../components/Spinner";

export const LoginComponent = () => {
  let navigate = useNavigate();
  let location = useLocation();
  const [openBackdrop, setBackdropOpen] = React.useState(false);
  const [username, setUserName] = React.useState("");
  const [email, setEmail] = React.useState<string | null>(null);
  const [phone, setPhone] = React.useState<string | null>(null);
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

  let from = (location.state as any)?.from?.pathname + (location.state as any)?.from?.search;

  const responseGoogle = async (response: any) => {
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
      if (res.status === 201 && res.data.user.roles) {
        localStorage.setItem("loginInfo", JSON.stringify({ token: res.data.token, expires_at: res.data.expires_at, name: res.data.user?.name }));
        let permissions: string[] = [];
        let roles: string[] = [];
        if (res.data.user.roles) {
          if (res.data.user.roles.includes("admin") || res.data.user.roles.includes("super-admin")) permissions = ["all"]
          roles = res.data.user.roles;
        }
        localStorage.setItem(
          "permissions",
          JSON.stringify(permissions)
        );
        localStorage.setItem("token", JSON.stringify(res.data.token));
        localStorage.setItem("roles", JSON.stringify(roles));
        auth.signin(
          res.data.user.name,
          res.data.user.email,
          res.data.user.id,
          permissions,
          roles,
          response.tokenId,
          () => {
            if (from) navigate(from, { replace: true });
          }
        );
      } else {
        toast.error("User not authorized! Contact Admin");
      }
    } catch (error: any) {
      if (error.response.status === 404) {
        toast.error("User not Found! Contact Admin");
      }
    }
  };

  const handleValueChange = (value: string, type: string) => {
    if (type === "name") {
      setUserName(value);
    } else if (type === "email") {
      setEmail(value.trim());
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
        } catch (error: any) {
          if (error.response.status === 500 || error.response.status === 409) {
            setBackdropOpen(false);
            toast.error(error.response.data.error);
          } else if (error.response.status === 400) {
            setBackdropOpen(false);
            toast.error("User already Registered!");
          }
        }
      }
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <div>
      <Backdrop className={classes.backdrop} open={openBackdrop}>
        <Spinner text={"Logging you in..."} />
      </Backdrop>
      <ToastContainer />
      <Grid
        container
        alignItems="center"
      >
        <Paper elevation={10} style={paperStyle}>
          <div
            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
          >
            <Avatar style={avatarStyle}>
              <LockOutlinedIcon />
            </Avatar>
            <h2>Sign Up</h2>
          </div>
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
              clientId={import.meta.env.VITE_APP_CLIENT_ID || ''}
              buttonText="Log in with Google"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
            />
          </div>
        </Paper>
      </Grid>
    </div>
  );
};

const UseStyle = makeStyles((theme: any) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
    },
  })
);
