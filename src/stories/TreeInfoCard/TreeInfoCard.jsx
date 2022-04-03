import React from "react";
import PropTypes from "prop-types";
import { createStyles, makeStyles } from "@mui/styles";

import icon from "../assets/markericon.png";

import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import SwipeableViews from "react-swipeable-views";

const UseStyle = makeStyles((theme) =>
  createStyles({
    main: {
      width: "100%",
      minHeight: "400px",
      height: "100%",
      borderRadius: "7px 0 0 7px",
      maxWidth: "500px",
      backgroundColor: "#1F3625",
      display: "inline-block",
      [theme.breakpoints.down("md")]: {
        "& .MuiFormControl-root": {
          width: "93%",
          margin: "12px",
        },
      },
    },
    info: {
      backgroundColor: "#ffffff",
      margin: "10px 10px 0px 10px",
      minHeight: "340px",
      height: "80vh",
      overflowX: "hidden",
      overflowY: "auto",
      borderRadius: "7px",
      minWidth: "93%",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    treeinfo: {
      paddingTop: "40%",
      paddingLeft: "7px",
    },
    memories: {
      marginLeft: "10px",
      marginBottom: "10px",
      display: "flex",
      flexWrap: "no-wrap",
      overflowX: "auto",
    },
    memimg: {
      borderRadius: "7px",
      flex: "0 0 auto",
      height: "200px",
      maxWidth: "330px",
      marginRight: "15px",
      objectFit: "cover",
    },
    navbtn: {
      display: "flex",
      justifyContent: "space-between",
      margin: "3vh 10px 15px 10px",
      color: "#ffffff",
    },
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

export const TreeInfoCard = ({ trees, activeStep, setIndex, ...props }) => {
  const classes = UseStyle();
  const theme = useTheme();

  const handleStepChange = (i) => {
    setIndex(i);
  };
  return (
    <div className={classes.main}>
      <div className={classes.info}>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {trees.map((step, index) => (
            <div key={step.label}>
              {Math.abs(activeStep - index) <= 2 ? (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    {/* <Box
                                    borderRadius={'7%'}
                                    component="img"
                                    sx={{
                                        height: 300,
                                        display: 'block',
                                        maxWidth: 300,
                                        overflow: 'hidden',
                                        width: '100%',
                                        padding: '10px',
                                    }}
                                */}
                    <img
                      style={{
                        borderRadius: "6%",
                        objectFit: "cover",
                        height: "300px",
                        width: "100%",
                        padding: "10px",
                      }}
                      src={step.tree.tree_id.image[0]}
                      alt={step.user}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <div className={classes.treeinfo}>
                      <div style={{ fontSize: "30px", fontWeight: "bold" }}>
                        {step.tree.tree_id.name}
                      </div>
                      <div style={{ fontSize: "25px", fontWeight: "400" }}>
                        {step.tree.tree_id.scientific_name}
                      </div>
                      <div
                        style={{
                          fontWeight: "300",
                          fontSize: "12px",
                          marginTop: "10px",
                        }}
                      >
                        Sapling ID: {step.tree.sapling_id}
                      </div>
                      <div style={{ fontWeight: "300", fontSize: "12px" }}>
                        Planted On: {step.tree.date_added.slice(0, 10)}
                      </div>
                      <Button
                        style={{ marginTop: "10px" }}
                        size="large"
                        variant="contained"
                        color="primary"
                      >
                        190 Plants
                      </Button>
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div style={{ display: "inline-flex", marginLeft: "10px" }}>
                      <img
                        src={icon}
                        alt={"icon"}
                        style={{ width: "30px", height: "30px" }}
                      />
                      <p
                        style={{
                          textAlign: "center",
                          lineHeight: "30px",
                          margin: "0 0 0 5px",
                        }}
                      >
                        Characteristics
                      </p>
                    </div>
                    <div
                      style={{ lineHeight: "15px", margin: "10px 0 0 15px" }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "350",
                          marginBottom: "5px",
                        }}
                      >
                        Family: {step.tree.tree_id.family}
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "350",
                          marginBottom: "5px",
                        }}
                      >
                        Habit: {step.tree.tree_id.habit}
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "350",
                          marginBottom: "5px",
                        }}
                      >
                        Remarkable Character:{" "}
                        {step.tree.tree_id.remarkable_char}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div style={{ display: "flex", marginLeft: "10px" }}>
                      <img
                        src={icon}
                        alt={"icon"}
                        style={{ width: "30px", height: "30px" }}
                      />
                      <p
                        style={{
                          textAlign: "center",
                          lineHeight: "30px",
                          margin: "0 0 0 5px",
                        }}
                      >
                        Benefits
                      </p>
                    </div>
                    <div
                      style={{ lineHeight: "15px", margin: "10px 0 0 15px" }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "350",
                          marginBottom: "5px",
                        }}
                      >
                        - {step.tree.tree_id.med_use}
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "350",
                          marginBottom: "5px",
                        }}
                      >
                        - {step.tree.tree_id.other_use}
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "350",
                          marginBottom: "5px",
                        }}
                      >
                        - {step.tree.tree_id.food}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={11}>
                    <p
                      style={{
                        borderBottom: "2px solid #e9e9e9",
                        marginLeft: "20px",
                      }}
                    ></p>
                  </Grid>
                  <Grid item xs={12}>
                    <div style={{ display: "flex", marginLeft: "10px" }}>
                      <img
                        src={icon}
                        alt={"icon"}
                        style={{ width: "30px", height: "30px" }}
                      />
                      <p
                        style={{
                          textAlign: "center",
                          lineHeight: "30px",
                          margin: "0 0 0 5px",
                        }}
                      >
                        Event: Individual Visit
                      </p>
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div className={classes.memories}>
                      {step.memories.map((img) => (
                        <img className={classes.memimg} src={img} alt={img} />
                      ))}
                    </div>
                  </Grid>
                </Grid>
              ) : null}
            </div>
          ))}
        </SwipeableViews>
      </div>
      <div className={classes.navbtn}>{props.children}</div>
    </div>
  );
};

TreeInfoCard.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  img: PropTypes.string,
  date: PropTypes.string,
};

export default TreeInfoCard;
