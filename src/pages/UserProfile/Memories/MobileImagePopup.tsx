import React, { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@mui/styles";
import { useSwipeable } from "react-swipeable";
import { Modal } from "@mui/material";

const useStyles = makeStyles({
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.85)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  container: {
    width: "96vw",
    height: "90vh",
    backgroundColor: "#000",
    borderRadius: 10,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    cursor: "pointer",
  },
  imageWrapper: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  arrow: {
    color: "white",
    fontSize: 32,
    cursor: "pointer",
  },
});

interface MobileImagePopupProps {
  images: string[];
  onClose: () => void;
}

const MobileImagePopup = ({ images, onClose }: MobileImagePopupProps) => {
  const [index, setIndex] = useState(0);
  const classes = useStyles();

  const prev = () => setIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  const next = () => setIndex((prev) => (prev + 1) % images.length);

  const handlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    //preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <Modal open={true}>
      <div className={classes.overlay}>
        <div className={classes.container} {...handlers}>
          <div className={classes.closeButton} onClick={onClose}>
            <CloseIcon style={{ color: "white", fontSize: 24 }} />
          </div>
          <div className={classes.imageWrapper}>
            <img
              src={images[index]}
              alt={`Image ${index + 1}`}
              className={classes.image}
            />
          </div>
          <div className={classes.controls}>
            <ArrowBackIosIcon onClick={prev} className={classes.arrow} />
            <ArrowForwardIosIcon onClick={next} className={classes.arrow} style={{ marginLeft: 20 }} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MobileImagePopup;
