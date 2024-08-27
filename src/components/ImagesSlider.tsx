import { FC, useEffect, useState, useRef, useCallback } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Popup } from "../stories/Popup/Popup";
import { Modal } from "@mui/material";

interface ImagesSliderInputProps {
  currentIndex?: number;
  open: boolean;
  onClose: () => void;
  images: string[];
}

export const ImagesSlider: FC<ImagesSliderInputProps> = ({
  currentIndex = 0,
  open,
  onClose,
  images,
}) => {
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:481px)");

  const [index, setIndex] = useState(currentIndex);
  const imageRefs = useRef<HTMLDivElement[]>([]);
  const [pos, setPos] = useState(0);

  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex]);

  const next = () => {
    if (index < images.length - 1) {
      setIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex((prevIndex) => prevIndex - 1);
    }
  };

  useEffect(() => {
    let translateX = 0;
    for (let i = 0; i < index; i++) {
      if (imageRefs.current[i]) {
        translateX += imageRefs.current[i].offsetWidth;
      }
    }
    setPos(translateX);
  }, [index]);

  return (
    <Modal open={open}>
      <div style={{ width: "100%", height: "100%" }}>
        <Popup toggle={onClose}>
          <div className={classes.slideshowWindow}>
            <div
              className={classes.slider}
              style={{
                transform: `translate3d(${-pos}px, 0, 0)`,
              }}
            >
              {images.map((image, idx) => (
                <div
                  className={classes.slide}
                  key={idx}
                  ref={(el) => (imageRefs.current[idx] = el!)}
                >
                  <img
                    className={classes.imageWindow}
                    src={image}
                    alt={`Slide ${idx}`}
                  />
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              marginLeft: matches ? "65%" : "85%",
              marginRight: "auto",
              width: "100%",
              paddingTop: "5px",
            }}
          >
            <ArrowBackIosIcon
              fontSize="large"
              style={{ color: "white", cursor: "pointer" }}
              onClick={prev}
            />
            <ArrowForwardIosIcon
              fontSize="large"
              style={{
                color: "white",
                cursor: "pointer",
                marginLeft: "30px",
              }}
              onClick={next}
            />
          </div>
        </Popup>
      </div>
    </Modal>
  );
};

const useStyles = makeStyles((theme: any) =>
  createStyles({
    slideshowWindow: {
      marginTop: "40px",
      overflow: "hidden",
      [theme.breakpoints.down("480")]: {
        marginTop: "30px",
      },
    },
    slider: {
      display: "flex",
      transition: "transform 1000ms ease",
    },
    slide: {
      flexShrink: 0,
      margin: "5px",
    },
    imageWindow: {
      borderRadius: "20px",
      objectFit: "cover",
      padding: "2%",
      maxHeight: "480px",
      [theme.breakpoints.down("480")]: {
        maxHeight: "300px",
      },
    },
  })
);
