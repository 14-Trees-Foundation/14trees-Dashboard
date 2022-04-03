import {
  Box,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { useState } from "react";

import bg from "../../assets/bg.png";
import vector from "../../assets/treevector.png";
import { AppBar } from "../../components/Appbar";
import Axios from "../../api/local";
import { Spinner } from "../../components/Spinner";
import { EmailForm } from "./components/EmailForm";
import { MoreInfo } from "./components/MoreInfo";
import { AddTree } from "./components/AddTree";
import { Memories } from "./components/Memories";
import { Summary } from "./components/Summary";

const intitialFValues = {
  name: "",
  email: "",
  contact: "",
  loading: false,
  userFound: false,
  userinfo: {},
  treeinfo: {},
  activeStep: 0,
  org: {},
  orgid: "",
  saplingId: "",
  userImages: [],
  userImage1: null,
  userImage1src: null,
  dlgOpen: false,
  croppedImage: null,
  additionalImages: [],
  uploaded: false,
};

export const VisitorNew = () => {
  const classes = UseStyle();
  const [values, setValues] = useState(intitialFValues);
  const steps = ["Enter info", "Org", "Tree", "Memories", "Submit"];

  const initialize = () => {
    setValues(intitialFValues);
  };

  const handleOrgChange = (orgid) => {
    setValues({
      ...values,
      orgid: orgid._id,
    });
  };

  const handleNameAndEmail = async () => {
    setValues({
      ...values,
      loading: true,
    });
    try {
      let res = await Axios.get(
        `/users/?email=${values.email}&name=${values.name}`
      );
      let orgRes = await Axios.get(`/organizations`);
      if (res.status === 200) {
        setValues({
          ...values,
          userFound: true,
          userinfo: res.data.user,
          treeinfo: res.data.tree,
          org: orgRes.data,
          activeStep: 1,
          loading: false,
        });
      }
    } catch (error) {
      setValues({
        ...values,
        activeStep: 1,
        loading: false,
      });
    }
  };

  const items = () => {
    switch (values.activeStep) {
      case 0:
        return (
          <EmailForm
            values={values}
            handleNameAndEmail={handleNameAndEmail}
            setValues={setValues}
          />
        );
      case 1:
        return (
          <MoreInfo
            values={values}
            setValues={setValues}
            handleOrgChange={handleOrgChange}
          />
        );
      case 2:
        return <AddTree values={values} setValues={setValues} />;
      case 3:
        return <Memories values={values} setValues={setValues} />;
      case 4:
        return (
          <Summary
            values={values}
            setValues={setValues}
            initialize={initialize}
          />
        );
      default:
        return <>OOps! Something bad happened</>;
    }
  };

  if (values.loading) {
    return <Spinner />;
  } else {
    return (
      <div className={classes.box}>
        <img alt="bg" src={bg} className={classes.bgimg} />
        <img alt="v" src={vector} className={classes.foot} />
        <div className={classes.overlay}>
          <AppBar />
          <Box
            sx={{
              width: {
                xs: "90vw",
                sm: "80vw",
                md: "75vw",
                lg: "65vw",
                xl: "50vw",
              },
              ml: "auto",
              mr: "auto",
              h: "90vh",
              pt: { xs: "10vh", md: "5vh" },
              position: "relative",
            }}
          >
            <Typography
              sx={{
                mt: { xs: "5%", md: "8%", lg: "10%" },
                fontSize: { xs: "24px", md: "27px" },
                lineHeight: "28px",
                color: "#9BC53D",
                fontWeight: "450",
              }}
            >
              14Trees welcomes you!
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "48px", md: "54px" },
                mt: "10px",
                mb: "20px",
                lineHeight: "60px",
                color: "#fff",
                fontWeight: "450",
              }}
            >
              Let's get you on-boarded
            </Typography>
            <Typography
              sx={{
                mt: "5px",
                fontSize: { xs: "14px", md: "17px" },
                lineHeight: "18px",
                color: "#fff",
                fontWeight: "400",
              }}
            >
              This will you help you in keep-in-touch with your tree.
            </Typography>
            <Box
              sx={{
                w: { xs: "90vw", md: "75vw" },
                mt: { xs: "24px", md: "40px" },
              }}
            >
              <Paper sx={{ p: { xs: "8px", md: "24px" } }}>
                <Stepper
                  activeStep={values.activeStep}
                  sx={{ display: { xs: "none", md: "flex" } }}
                >
                  {steps.map((label, index) => {
                    return (
                      <Step
                        key={label}
                        sx={{
                          "& .MuiStepLabel-root .Mui-completed": {
                            color: "#1f3625",
                          },
                          "& .MuiStepLabel-root .Mui-active": {
                            color: "#9BC53D",
                          },
                        }}
                      >
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                <Box sx={{ p: { xs: 1, md: 3 }, mt: 2 }}>{items()}</Box>
              </Paper>
            </Box>
          </Box>
        </div>
      </div>
    );
  }
};

const UseStyle = makeStyles((theme) =>
  createStyles({
    box: {
      width: "100%",
      minHeight: "100vh",
      position: "relative",
      backgroundColor: "#e5e5e5",
      [theme.breakpoints.down("540")]: {
        height: "100%",
      },
      "& .MuiFormControl-root": {
        width: "100%",
        margin: "12px 0px",
      },
    },
    bgimg: {
      width: "100%",
      height: "50vh",
      objectFit: "cover",
    },
    foot: {
      marginTop: "-10px",
      height: "100px",
      width: "100%",
      [theme.breakpoints.down("480")]: {
        height: "50px",
      },
    },
    overlay: {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "50vh",
      background:
        "linear-gradient(358.58deg, #1F3625 37.04%, rgba(31, 54, 37, 0.636721) 104.2%, rgba(31, 54, 37, 0) 140.95%)",
    },
  })
);
