import * as React from "react";
import {
  Dialog,
  DialogContent,
  Slide,
  Button,
  RadioGroup,
  Grid,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useRef } from "react";
import { makeStyles } from "@mui/styles";
import "react-toastify/dist/ReactToastify.css";

import hny from "../../assets/gift/hny.png";
import bd from "../../assets/gift/bd.png";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const ShareDialog = (props) => {
  const classes = useStyles();
  const canRef = useRef(null);
  const img1Ref = useRef(null);
  const img2Ref = useRef(null);
  const { onClose, open, submit, handleClick } = props;
  const [value, setValue] = React.useState("1");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleDownload = async () => {
    submit(value);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="md"
    >
      <DialogContent>
        <div
          style={{ marginLeft: "auto", marginRight: "auto", maxWidth: "720px" }}
        >
          <div className={classes.actions} style={{ paddingBottom: "32px" }}>
            <Button variant="contained" color="secondary" onClick={handleClick}>
              Go to Dashboard
            </Button>
          </div>
          <RadioGroup
            aria-label="gender"
            name="controlled-radio-buttons-group"
            value={value}
            onChange={handleChange}
          >
            <canvas
              ref={canRef}
              width={2191}
              height={2884}
              style={{ display: "none" }}
            />
            <img ref={img1Ref} style={{ display: "none" }} alt="" />
            <img ref={img2Ref} style={{ display: "none" }} alt="" />
            <Grid container spacing={2} style={{ textAlign: "center" }}>
              <Grid item xs={12} lg={6}>
                <img src={bd} alt="" className={classes.img} />
                <div style={{ width: "100%", textAlign: "center" }}>
                  <span style={{ fontSize: "16px", paddingRight: "8px" }}>
                    Wish Birthday
                  </span>
                  <FormControlLabel value="1" control={<Radio />} label="" />
                </div>
              </Grid>
              <Grid item xs={12} lg={6}>
                <img src={hny} alt="" className={classes.img} />
                <div style={{ width: "100%", textAlign: "center" }}>
                  <span style={{ fontSize: "16px", paddingRight: "8px" }}>
                    Happy New Year
                  </span>
                  <FormControlLabel value="2" control={<Radio />} label="" />
                </div>
              </Grid>
            </Grid>
          </RadioGroup>
          <div className={classes.actions}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDownload}
            >
              Download Card
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
    padding: theme.spacing(3),
    "& .MuiButton-root": {
      minWidth: "100%",
      maxWidth: "100%",
      minHeight: "6vh",
    },
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
  img: {
    width: "auto",
    height: "300px",
    borderRadius: "10px",
  },
}));
