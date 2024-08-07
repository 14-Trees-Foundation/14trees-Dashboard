import { createStyles, makeStyles } from "@mui/styles";
import logo from "../../assets/logo_white_small.png";
import { useNavigate } from "react-router-dom";

export const Appbar = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  return (
    <div className={classes.appbar}>
      <img className={classes.logo} src={logo} alt="logo" onClick={() => { navigate("/") }}/>
    </div>
  );
};

const useStyles = makeStyles((theme) =>
  createStyles({
    appbar: {
      display: "flex",
      minHeight: "70px",
      maxHeight: "120px",
    },
    logo: {
      width: "60px",
      height: "70px",
      padding: theme.spacing(3),
    },
  })
);
