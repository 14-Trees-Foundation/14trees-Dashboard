import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Slide,
  Button,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const PwdDialog = (props) => {
  const classes = useStyles();
  const { onClose, open, passwd } = props;
  const [error, setError] = useState(false);
  const [pwd, setPwd] = useState("");

  const handleSubmit = () => {
    if (pwd === passwd) {
      onClose();
    } else {
      setError(true);
    }
  };
  const handlePwd = (event) => {
    setPwd(event.target.value);
  };
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <div className={classes.title}>
          Please enter the password to continue
        </div>
      </DialogTitle>
      <DialogContent>
        <div
          style={{ marginLeft: "auto", marginRight: "auto", maxWidth: "380px" }}
        >
          <TextField
            variant="outlined"
            label="Password"
            onChange={(e) => handlePwd(e)}
            fullWidth
            type={"password"}
            error={error}
          />
          <div className={classes.actions}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Login
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: "23px",
    fontWeight: "400",
    color: "#312F30",
    textAlign: "center",
    margin: theme.spacing(4),
  },
  actions: {
    "& .MuiDialogActions-root": {
      display: "block",
      paddingBottom: theme.spacing(3),
    },
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(3),
    paddingLeft: theme.spacing(4),
    "& .MuiButton-root": {
      minWidth: "100%",
      maxWidth: "100%",
      minHeight: "6vh",
    },
  },
}));
