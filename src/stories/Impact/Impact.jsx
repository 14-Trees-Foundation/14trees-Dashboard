import React, { useEffect, useRef } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import { gsap } from "gsap";

export const Impact = ({ count, text, size, ...props }) => {
  const classes = useStyles();
  const countRef = useRef(null);

  useEffect(() => {
    // Convert count to a string and parse it to a number if it's a string with a plus sign
    const countString = count.toString();
    const finalCount = parseInt(countString.replace('+', ''), 10);

    // GSAP animation to increment the count
    if (countRef.current) {
      gsap.fromTo(
        countRef.current,
        { innerText: 0 },
        {
          innerText: finalCount,
          duration: 4,
          ease: "power3.out",
          snap: { innerText: 1 }, // Snap to whole numbers
          onUpdate: function () {
            if (countRef.current) {
              countRef.current.innerText = Math.ceil(this.targets()[0].innerText);
            }
          },
        }
      );
    }
  }, [count]);

  return (
    <div className={classes[`card${size}`]}>
      <div className={classes.header} ref={countRef}>0</div>
      <div className={classes.footer}>{text}</div>
    </div>
  );
};

Impact.defaultProps = {
  count: "190",
  text: "14 Trees",
  size: "small",
};

const useStyles = makeStyles((theme) =>
  createStyles({
    cardsmall: {
      margin: "7px 7px 7px 0",
      minWidth: "70px",
      maxWidth: "190px",
      minHeight: "15%",
      backgroundColor: "#ffffff",
      borderRadius: "18px",
      padding: "20px",
    },
    cardlarge: {
      margin: "7px 7px 7px 0",
      minWidth: "82%",
      maxWidth: "400px",
      backgroundColor: "#ffffff",
      borderRadius: "18px",
      padding: "20px",
      [theme.breakpoints.down("lg")]: {
        minWidth: "78%",
      },
    },
    header: {
      fontSize: "30px",
      fontWeight: "600",
      color: "#9BC53D",
      textAlign: "center",
    },
    footer: {
      paddingTop: "5px",
      fontSize: "12px",
      fontWeight: "500",
      textAlign: "center",
    },
  })
);
