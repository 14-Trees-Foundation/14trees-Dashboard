import { createStyles, makeStyles } from "@mui/styles";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Popup } from "../../../stories/Popup/Popup";
import { useRecoilValue, useRecoilState } from "recoil";
import { usersData, openMemoryPopup, selUsersData } from "../../../store/atoms";
import { useState, useRef, useEffect } from "react";
import { ImageViewer } from "../../../components/ImageViewer";
import MobileImagePopup from "./MobileImagePopup";
import { gsap } from "gsap";

export const Memories = () => {
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:481px)");
  const isMobile = useMediaQuery("(max-width:600px)");

  const selUserInfo = useRecoilValue(selUsersData);
  const [open, setOpenPopup] = useRecoilState(openMemoryPopup);
  const [index, setIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const sliderRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);

  let images = [];
  images.push.apply(images, selUserInfo["memory_images"]);
  images.push.apply(images, selUserInfo["visit_images"]);

  let allImages = [
    6, 1, 3, 5, 4, 8, 9, 1, 11, 12, 13, 14, 15, 23, 16, 17, 18, 19, 20, 21, 22,
  ].map((number) => {
    return `https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory${number}.jpg`;
  });

  images = [...new Set(images)];
  images = images.filter((e) => e);
  images = [...images, ...allImages];
  images = images.map((image) => image.replace(/#/g, "%23"));

  const next = () => {
    setIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
  };

  const prev = () => {
    setIndex((prevIndex) => (prevIndex !== 0 ? prevIndex - 1 : images.length - 1));
  };

  const onTogglePop = () => {
    setOpenPopup(!open);
  };

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  const handleManualInteraction = () => {
    setIsAutoScrolling(false);
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }
  };

  useEffect(() => {
    if (sliderRef.current) {
      gsap.to(sliderRef.current, {
        x: -index * 220,
        duration: 1,
        ease: "power3.out",
      });
    }
  }, [index, matches, images]);

  useEffect(() => {
    // Preload images
    const loadImages = async () => {
      const imagePromises = images.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error loading images:', error);
        setImagesLoaded(true); // Still set to true to allow interaction even if some images fail to load
      }
    };

    loadImages();
  }, [images]);

  useEffect(() => {
    if (imagesLoaded && isAutoScrolling) {
      autoScrollIntervalRef.current = setInterval(() => {
        next();
      }, 3000);
    }

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [imagesLoaded, isAutoScrolling]);

  if (open) {
    return isMobile ? (
      <MobileImagePopup images={images} onClose={onTogglePop} />
    ) : (
      <div style={{ width: "100%", height: "100%" }}>
        <Popup toggle={onTogglePop}>
          <div className={classes.slideshowWindow}>
            <div className={classes.slider} ref={sliderRef}>
              {images.map((image, idx) => (
                <div className={classes.slide} key={idx}>
                  <img className={classes.memimageWindow} src={image} alt={"A"} />
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
              onClick={() => {
                handleManualInteraction();
                prev();
              }}
            />
            <ArrowForwardIosIcon
              fontSize="large"
              style={{ color: "white", cursor: "pointer", marginLeft: "30px" }}
              onClick={() => {
                handleManualInteraction();
                next();
              }}
            />
          </div>
        </Popup>
      </div>
    );
  } else {
    return (
      <div className={classes.main}>
        <div className={classes.header}>
          <div style={{ fontSize: "16px", fontWeight: "700", padding: "5px" }}>
            Memories
          </div>
          <div
            style={{
              marginLeft: "auto",
              marginRight: "20px",
              paddingTop: "5px",
            }}
          >
            <ArrowBackIosIcon
              fontSize="small"
              style={{ color: "green", cursor: "pointer" }}
              onClick={() => {
                handleManualInteraction();
                prev();
              }}
            />
            <ArrowForwardIosIcon
              fontSize="small"
              style={{ color: "green", cursor: "pointer" }}
              onClick={() => {
                handleManualInteraction();
                next();
              }}
            />
          </div>
        </div>
        <div className={classes.slideshow}>
          <div 
            className={classes.slider} 
            ref={sliderRef}
            onMouseEnter={handleManualInteraction}
            onTouchStart={handleManualInteraction}
          >
            {images.map((image, idx) => (
              <div className={classes.slide} key={idx}>
                <div className={classes.memimage}>
                  <ImageViewer image={image} handleClick={handleOpenPopup} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

const useStyles = makeStyles((theme) =>
  createStyles({
    main: {
      width: "100%",
      maxHeight: "100%",
      borderRadius: "15px",
      backgroundColor: "#ffffff",
      marginLeft: "20px",
      boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.15)",
      [theme.breakpoints.down("1500")]: {
        width: "calc(100% - 20px)",
      },
      [theme.breakpoints.down("480")]: {
        marginLeft: "1px",
        marginTop: "15px",
        width: "100%",
      },
      [theme.breakpoints.between("481", "900")]: {
        marginLeft: "0px",
        width: "100%",
        marginTop: "15px",
        marginBottom: "15px",
      },
    },
    header: {
      display: "flex",
      paddingTop: "3%",
      paddingLeft: "3%",
    },
    slideshow: {
      margin: "5px",
      overflow: "hidden",
    },
    slideshowWindow: {
      marginTop: "40px",
      overflow: "hidden",
      [theme.breakpoints.down("480")]: {
        marginTop: "30px",
      },
    },
    slider: {
      whiteSpace: "nowrap",
    },
    slide: {
      display: "inline-block",
      margin: "5px",
    },
    memimage: {
      width: "210px",
      height: "190px",
      borderRadius: "15px",
      objectFit: "cover",
      padding: "2%",
      paddingTop: "4px",
      cursor: "pointer",
      [theme.breakpoints.down("1500")]: {
        width: "170px",
        height: "160px",
      },
    },
    memimageWindow: {
      width: "auto",
      height: "480px",
      borderRadius: "20px",
      objectFit: "cover",
      padding: "2%",
      [theme.breakpoints.down("480")]: {
        width: "auto",
        height: "300px",
      },
    },
  })
);
