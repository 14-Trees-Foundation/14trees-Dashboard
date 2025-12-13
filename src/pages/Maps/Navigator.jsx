import { Fragment } from "react";
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
            <span>{t('navigation.nextTree')}</span>
            <KeyboardArrowRightIcon fontSize={"large"} />
          </div>
        </Fragment>
      )}
      {activeStep < maxSteps - 1 && activeStep > 0 && (
        <Fragment>
          <div className={classes.keybtn} onClick={onClickPrev}>
            <KeyboardArrowLeftIcon fontSize={"large"} />
            <span>{t('navigation.prevTree')}</span>
          </div>
          <div className={classes.keybtn} onClick={onClickNext}>
            <span>{t('navigation.nextTree')}</span>
            <KeyboardArrowRightIcon fontSize={"large"} />
          </div>
        </Fragment>
      )}
      {activeStep === maxSteps - 1 && (
        <Fragment>
          <div className={classes.keybtn} onClick={onClickPrev}>
            <KeyboardArrowLeftIcon fontSize={"large"} />
            <span>{t('navigation.prevTree')}</span>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};
