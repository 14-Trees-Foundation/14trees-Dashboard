import { CircularProgress } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

export const Progress = () => {
  const classes = useStyles();

  return (
    <div className={classes.imgLoader}>
      <CircularProgress color="primary" />
    </div>
  );
};

const useStyles = makeStyles((theme) =>
  createStyles({
    imgLoader: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      borderRadius: "12px",
      display: "flex",
      justifyContent: "center",
      backgroundColor: "#d9d9d9",
      "& .MuiCircularProgress-root": {
        color: "#b5b5b5",
      },
    },
  })
);
