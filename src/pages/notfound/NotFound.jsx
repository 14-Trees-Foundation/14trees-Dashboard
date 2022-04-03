import React from "react";
import { Grid } from "@mui/material";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { createStyles, makeStyles } from "@mui/styles";
import notfound from "../../assets/user.png";

export const NotFound = () => {
  const classes = useStyles();
  return (
    <Grid container>
      <Grid item xs={12}>
        <img src={notfound} alt="Page Not Found" className={classes.img} />
      </Grid>
      <Grid item xs={12} className={classes.text}>
        The requested page is lost in the Forest!
        <br></br>
        Please check if you are on right Trail!
      </Grid>
      <Grid xs={12} className={classes.btn}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          component={Link}
          to="/home"
        >
          14Trees Home
        </Button>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme) =>
  createStyles({
    img: {
      width: "30%",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: "5%",
    },
    text: {
      fontWeight: "450",
      fontSize: "38px",
      display: "flex",
      justifyContent: "center",
      textAlign: "justify",
      textAlignLast: "center",
    },
    btn: {
      display: "flex",
      justifyContent: "center",
      marginTop: "20px",
    },
  })
);
