import { Fragment } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const UseStyle = makeStyles((theme) =>
  createStyles({
    keybtn: {
      cursor: "pointer",
      fontSize: "20px",
      fontWeight: "350",
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
    },
  })
);

export const Navigator = ({ activeStep, maxSteps, handleBack, handleNext }) => {
  const classes = UseStyle();

  const onClickPrev = () => {
    handleBack();
  };

  const onClickNext = () => {
    handleNext();
  };

  return (
    <Fragment>
      {activeStep === 0 && (
        <Fragment>
          <span></span>
          <div className={classes.keybtn} onClick={onClickNext}>
            <span>Next Tree</span>
            <KeyboardArrowRightIcon fontSize={"large"} />
          </div>
        </Fragment>
      )}
      {activeStep < maxSteps - 1 && activeStep > 0 && (
        <Fragment>
          <div className={classes.keybtn} onClick={onClickPrev}>
            <KeyboardArrowLeftIcon fontSize={"large"} />
            <span>Prev Tree</span>
          </div>
          <div className={classes.keybtn} onClick={onClickNext}>
            <span>Next Tree</span>
            <KeyboardArrowRightIcon fontSize={"large"} />
          </div>
        </Fragment>
      )}
      {activeStep === maxSteps - 1 && (
        <Fragment>
          <div className={classes.keybtn} onClick={onClickPrev}>
            <KeyboardArrowLeftIcon fontSize={"large"} />
            <span>Prev Tree</span>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};
