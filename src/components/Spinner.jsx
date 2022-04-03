import { makeStyles } from "@mui/styles";
import gif from "../assets/loader_light.gif";

export const Spinner = ({ text }) => {
  const classes = usestyle();

  if (text === "" || text === undefined) {
    text = "This forest is dense, taking some time to reach your destination!";
  }
  return (
    <div className={classes.spinner}>
      <img className={classes.img} src={gif} alt="Loader" />
      <p className={classes.text}>{text}</p>
    </div>
  );
};

const usestyle = makeStyles((theme) => ({
  spinner: {
    background: "#1f3625",
    position: "absolute",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
    zIndex: "999",
  },
  img: {
    display: "block",
    marginTop: "15%",
    marginLeft: "auto",
    marginRight: "auto",
    width: "200px",
    height: "200px",
    marginBottom: "2%",
    zIndex: "1000",
  },
  text: {
    fontSize: "30px",
    color: "#ffffff",
    fontWeight: "500",
    textAlign: "center",
    zIndex: "1000",
  },
}));
