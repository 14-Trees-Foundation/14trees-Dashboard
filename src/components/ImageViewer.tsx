import { createStyles, makeStyles } from "@mui/styles";
import { useState } from "react";
import { Progress } from "./CircularProgress";

interface Props {
  image: string;
  handleClick: () => {};
}
export const ImageViewer = ({ image, handleClick }: Props) => {
  const classes = useStyles();
  const [load, setLoad] = useState(false);
  return (
    <>
      {!load && <Progress />}
      <img
        onClick={handleClick}
        className={load ? classes.image : classes.none}
        alt="Card"
        onLoad={() => setLoad(true)}
        src={image}
      />
    </>
  );
};

const useStyles = makeStyles(() =>
  createStyles({
    none: {
      display: "none",
    },
    image: {
      width: "96%",
      height: "96%",
      borderRadius: "15px",
      objectFit: "cover",
      padding: "2%",
      cursor: "pointer",
    },
  })
);
