import { useState, useEffect } from "react";

import { createStyles, makeStyles } from "@mui/styles";
import { Field, Form } from "react-final-form";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Backdrop from "@mui/material/Backdrop";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {
  Paper,
  Typography,
  Avatar,
  Dialog,
  DialogActions,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop from "react-image-crop";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import bg from "../../assets/bg.png";
import tree from "../../assets/dark_logo.png";
import { Spinner } from "../../components/Spinner";

import Axios from "../../api/local";

import { AppBar } from "../../components/Appbar";
import imageCompression from "browser-image-compression";
import { GetCroppedImg } from "../../helpers/imageCrop";

const intitialFValues = {
  userImages: [],
  userImage1: null,
  uimageerror: null,
  additionalImages: [],
  userImage1src: null,
  addImage1src: null,
  addImage2src: null,
  addImage3src: null,
  addimageerror: null,
  orgid: "",
  uploaded: false,
  loading: true,
  backdropOpen: false,
  dlgOpen: false,
  plantedByChecked: true,
};

export const Visitor = () => {
  const [values, setValues] = useState(intitialFValues);
  const [org, setOrg] = useState({});
  const PROFILE_IMG_MAX = 1;
  const ADDITIONAL_IMG_MAX = 10;
  const [croppedImg, setCroppedImg] = useState(null);
  const [cropImgsrc, setCropImgsrc] = useState(null);
  const [imageRef, setImageRef] = useState();

  const [crop, setCrop] = useState(
    // default crop config
    {
      unit: "%",
      width: 40,
      aspect: 9 / 11,
    }
  );
  const classes = UseStyle();

  useEffect(() => {
    (async () => {
      // Get Org types
      let orgRes = await Axios.get(`/organizations`);
      if (orgRes.status === 200) {
        setOrg(orgRes.data);
      }
      setValues({
        ...values,
        loading: false,
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const compressImageList = async (file) => {
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1680,
      useWebWorker: true,
    };

    let compressedFile;

    try {
      compressedFile = await imageCompression(file, options);
    } catch (error) {
      console.log(error);
    }
    return new File([compressedFile], file.name);
  };

  const handleAdditionalPicUpload = async (e) => {
    if (Array.from(e.target.files).length > ADDITIONAL_IMG_MAX) {
      setValues({
        ...values,
        addimageerror: true,
      });
      return;
    }
    setValues({
      ...values,
      additionalImages: e.target.files,
      addImage1src: URL.createObjectURL(e.target.files[0]),
      addImage2src: e.target.files[1]
        ? URL.createObjectURL(e.target.files[1])
        : null,
      addImage3src: e.target.files[2]
        ? URL.createObjectURL(e.target.files[2])
        : null,
      addimageerror: null,
    });
  };

  const handleProfilePicUpload = (e) => {
    if (Array.from(e.target.files).length > PROFILE_IMG_MAX) {
      setValues({
        ...values,
        uimageerror: true,
      });
      return;
    }
    setValues({
      ...values,
      userImages: e.target.files,
      userImage1: e.target.files[0] ? e.target.files[0] : null,
      userImage1src: e.target.files[0]
        ? URL.createObjectURL(e.target.files[0])
        : null,
      uimageerror: null,
      dlgOpen: true,
    });
  };

  async function cropImage(crop) {
    let random = Math.random().toString(36).substr(2, 5);
    if (imageRef && crop.width && crop.height) {
      const croppedImage = await GetCroppedImg(
        imageRef,
        crop,
        "croppedImage" + random + ".jpeg" // destination filename
      );

      // calling the props function to expose
      setCroppedImg(croppedImage);
      setCropImgsrc(croppedImage ? URL.createObjectURL(croppedImage) : null);
    }
  }

  const handleOrgChange = (orgid) => {
    setValues({
      ...values,
      orgid: orgid._id,
    });
  };

  const formSubmit = async (formValues) => {
    setValues({
      ...values,
      loading: true,
      backdropOpen: true,
    });
    const formData = new FormData();
    formData.append("name", formValues.name);
    formData.append("email", formValues.email);
    formData.append("org", values.orgid);
    formData.append("contact", formValues.phone);
    formData.append("sapling_id", formValues.saplingid);
    formData.append("plantation_type", "onsite");
    const extraImages = [];
    if (croppedImg) {
      let userImages = [];
      let image = await compressImageList(croppedImg);
      formData.append("files", image);
      userImages.push(croppedImg.name);
      formData.append("userimages", userImages);
    }

    if (values.additionalImages) {
      for (const key of Object.keys(values.additionalImages)) {
        let image = await compressImageList(values.additionalImages[key]);
        formData.append("files", image);
        extraImages.push(values.additionalImages[key].name);
      }
    }

    if (formValues.planted_by) {
      formData.append("planted_by", formValues.planted_by);
    }

    formData.append("memoryimages", extraImages);
    try {
      let res = await Axios.post("/profile/usertreereg", formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        setValues({
          ...values,
          loading: false,
          uploaded: true,
        });
        toast.success("Data uploaded successfully!");
      } else if (
        res.status === 204 ||
        res.status === 400 ||
        res.status === 409 ||
        res.status === 404
      ) {
        setValues({
          ...values,
          loading: false,
          backdropOpen: false,
        });
        toast.error(res.status.error);
      }
    } catch (error) {
      setValues({
        ...values,
        loading: false,
        backdropOpen: false,
      });
      if (error.response.status === 409 || error.response.status === 404) {
        toast.error(error.response.data.error);
      }
    }
  };

  const handlePlantedBy = (event) => {
    setValues({
      ...values,
      plantedByChecked: event.target.checked
    });
  };

  if (values.uploaded) {
    return (
      <div className={classes.box}>
        <img alt="bg" src={bg} className={classes.bgimg} />
        <div className={classes.overlay}>
          <AppBar />
          <div className={classes.main}>
            <div className={classes.infobox}>
              <h1 className={classes.infoheader}>Thank You!</h1>
              <p className={classes.infodesc}>We have saved your data!</p>
            </div>
            <div className={classes.sucessbox}>
              <Card className={classes.maincard}>
                <CardContent style={{ marginTop: "1%" }}>
                  <Alert severity="success">
                    Your data has been uploaded successfuly!
                  </Alert>
                  <CardMedia
                    className={classes.media}
                    image={tree}
                    title="tree"
                  />
                  <CardActions>
                    <Button
                      style={{ marginLeft: "auto", marginRight: "auto" }}
                      size="large"
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        setValues(intitialFValues);
                      }}
                    >
                      Add more Visitor
                    </Button>
                  </CardActions>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={classes.box}>
        <img alt="bg" src={bg} className={classes.bgimg} />
        <div className={classes.overlay}>
          <AppBar />
          <div className={classes.main}>
            <div className={classes.infobox}>
              <h1 className={classes.infoheader}>Thank You!</h1>
              <p className={classes.infodesc}>
                We need some details to get you on-boarded for this journey!
              </p>
            </div>
            <div className={classes.inputbox}>
              <Paper className={classes.paper}>
                <Backdrop
                  className={classes.backdrop}
                  open={values.backdropOpen}
                >
                  <Spinner text={"Sending your data..."} />
                </Backdrop>
                <ToastContainer />
                {values.uimageerror && (
                  <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    Please select at max two profile images only
                  </Alert>
                )}
                {values.addimageerror && (
                  <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    Please select at max 10 additional images only
                  </Alert>
                )}
                <h1 className={classes.formheader}>Visitor Form</h1>
                <Form
                  onSubmit={formSubmit}
                  validate={(values) => {
                    const errors = {};
                    if (!values.name) {
                      errors.name =
                        "The name you want to be displayed on the physical name plate.";
                    }
                    if (!values.email) {
                      errors.email = "Email required.";
                    }
                    if (!values.saplingid) {
                      errors.saplingid =
                        "The unique number you received from 14Trees staff.";
                    }
                    return errors;
                  }}
                  render={({ handleSubmit, form, submitting, pristine }) => (
                    <form
                      onSubmit={handleSubmit}
                      className={classes.root}
                      autoComplete="off"
                    >
                      <Grid container>
                        <Grid item xs={12} sm={6} md={6}>
                          <Field name="name">
                            {({ input, meta }) => (
                              <TextField
                                error={
                                  meta.error && meta.touched ? true : false
                                }
                                {...input}
                                variant="outlined"
                                label="In Name Of*"
                                name="name"
                                helperText={
                                  meta.error && meta.touched ? meta.error : ""
                                }
                              />
                            )}
                          </Field>
                          <Field name="email">
                            {({ input, meta }) => (
                              <TextField
                                variant="outlined"
                                label="Email *"
                                name="email"
                                error={
                                  meta.error && meta.touched ? true : false
                                }
                                {...input}
                                helperText={
                                  meta.error && meta.touched ? meta.error : ""
                                }
                              />
                            )}
                          </Field>
                          <FormControlLabel control={<Checkbox checked={values.plantedByChecked} onChange={handlePlantedBy}/>} label="'In name of' and planter is same" />
                          {
                            !values.plantedByChecked && (
                              <Field name="planted_by">
                            {({ input, meta }) => (
                              <TextField
                                variant="outlined"
                                label="Planted By"
                                name="planted_by"
                                fullWidth
                                error={
                                  meta.error && meta.touched ? true : false
                                }
                                {...input}
                                sx={{ mb: 2 }}
                                helperText={
                                  meta.error && meta.touched ? meta.error : ""
                                }
                              />
                            )}
                          </Field>
                            )
                          }
                          {values.userImage1src !== null && (
                            <Dialog
                              onClose={() => {}}
                              disableEscapeKeyDown
                              open={values.dlgOpen}
                            >
                              <ReactCrop
                                src={values.userImage1src}
                                crop={crop}
                                onImageLoaded={(imageRef) =>
                                  setImageRef(imageRef)
                                }
                                onComplete={(cropConfig) =>
                                  cropImage(cropConfig)
                                }
                                onChange={(c) => setCrop(c)}
                              />
                              <DialogActions
                                onClick={() =>
                                  setValues({ ...values, dlgOpen: false })
                                }
                              >
                                I'm Done
                              </DialogActions>
                            </Dialog>
                          )}
                          <div style={{ marginTop: "20px" }}>
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              className={classes.helper}
                            >
                              Upload a photograph of yours with sapling.
                            </Typography>
                            <input
                              accept="image/*"
                              className={classes.input}
                              id="contained-button-file"
                              type="file"
                              onChange={handleProfilePicUpload}
                            />
                          </div>
                          <div className={classes.submitDiv}>
                            <Avatar
                              alt="U"
                              src={cropImgsrc ? cropImgsrc : null}
                            />
                            <span className={classes.span}></span>
                            <label
                              htmlFor="contained-button-file"
                              style={{ display: "block", marginTop: "5px" }}
                            >
                              <Button
                                component="span"
                                variant="contained"
                                color="secondary"
                                size="small"
                                style={{ minWidth: "170px" }}
                              >
                                Upload your pic
                              </Button>
                            </label>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                          <Field name="saplingid">
                            {({ input, meta }) => (
                              <TextField
                                variant="outlined"
                                label="Tree ID *"
                                name="saplingid"
                                error={
                                  meta.error && meta.touched ? true : false
                                }
                                {...input}
                                helperText={
                                  meta.error && meta.touched ? meta.error : ""
                                }
                              />
                            )}
                          </Field>
                          <Autocomplete
                            id="treetype"
                            options={org}
                            autoHighlight
                            getOptionLabel={(option) => option.name}
                            onChange={(event, newValue) => {
                              handleOrgChange(newValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Organization"
                                variant="outlined"
                              />
                            )}
                          />
                          <Field name="phone">
                            {({ input, meta }) => (
                              <TextField
                                variant="outlined"
                                label="Contact *"
                                name="phone"
                                {...input}
                              />
                            )}
                          </Field>
                          <div style={{ marginTop: "15px" }}>
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              className={classes.helper}
                            >
                              Feel free to share the photographs from your visit
                              (max: 10)
                            </Typography>
                            <input
                              accept="image/*"
                              className={classes.input}
                              id="additional-image-file"
                              multiple
                              type="file"
                              onChange={handleAdditionalPicUpload}
                            />
                          </div>
                          <div className={classes.submitDiv}>
                            <Avatar
                              alt="U"
                              src={
                                values.addImage1src ? values.addImage1src : null
                              }
                            />
                            <Avatar
                              alt="U"
                              src={
                                values.addImage2src ? values.addImage2src : null
                              }
                            />
                            <Avatar
                              alt="U"
                              src={
                                values.addImage3src ? values.addImage3src : null
                              }
                            />
                            <span className={classes.span}></span>
                            <label
                              htmlFor="additional-image-file"
                              style={{ display: "block", marginTop: "5px" }}
                            >
                              <Button
                                component="span"
                                variant="contained"
                                color="secondary"
                                size="small"
                                style={{ minWidth: "170px" }}
                              >
                                Add more pics
                              </Button>
                            </label>
                          </div>
                        </Grid>
                        {!values.uimageerror && !values.addimageerror && (
                          <div className={classes.submitbtn}>
                            <Button
                              size="large"
                              variant="contained"
                              color="primary"
                              disabled={submitting || pristine}
                              type="submit"
                            >
                              Submit
                            </Button>
                          </div>
                        )}
                      </Grid>
                    </form>
                  )}
                />
              </Paper>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const UseStyle = makeStyles((theme) =>
  createStyles({
    box: {
      width: "100%",
      height: "100vh",
      position: "relative",
      backgroundColor: "#e5e5e5",
      [theme.breakpoints.down("540")]: {
        height: "100%",
      },
    },
    root: {
      "& .MuiFormControl-root": {
        width: "93%",
        margin: "12px",
      },
      "& .MuiFormControlLabel-root": {
        marginLeft: "4px",
      },
    },
    bgimg: {
      width: "100%",
      height: "45vh",
      objectFit: "cover",
    },
    overlay: {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "45vh",
      background:
        "linear-gradient(358.58deg, #1F3625 37.04%, rgba(31, 54, 37, 0.636721) 104.2%, rgba(31, 54, 37, 0) 140.95%)",
    },
    main: {
      width: "75vw",
      paddingLeft: "12.5vw",
      paddingTop: "5vh",
      height: "90vh",
      position: "relative",
      [theme.breakpoints.down("748")]: {
        width: "80vw",
        paddingLeft: "9vw",
      },
      [theme.breakpoints.down("540")]: {
        width: "90vw",
        paddingLeft: "1.5vw",
      },
    },
    infobox: {
      marginTop: "5%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      [theme.breakpoints.down("md")]: {
        flexWrap: "wrap",
      },
    },
    infoheader: {
      fontSize: "55px",
      color: "#9BC53D",
      fontWeight: "550",
      [theme.breakpoints.down("md")]: {
        fontSize: "50px",
      },
    },
    infodesc: {
      fontSize: "22px",
      paddingLeft: "1%",
      color: "#ffffff",
      fontWeight: "500",
      alignItems: "center",
      textAlign: "center",
      [theme.breakpoints.down("md")]: {
        fontSize: "15px",
      },
    },
    inputbox: {
      width: "75vw",
      height: "90vh",
      position: "relative",
      [theme.breakpoints.down("md")]: {
        width: "90vw",
        paddingLeft: "4vw",
      },
    },
    paper: {
      padding: theme.spacing(3),
      [theme.breakpoints.down("md")]: {
        margin: theme.spacing(0),
        padding: "0px",
      },
    },
    successbox: {
      width: "60vw",
      paddingLeft: "12.5%",
      height: "90vh",
      position: "relative",
      [theme.breakpoints.down("md")]: {
        width: "90vw",
        paddingLeft: "0",
      },
    },
    maincard: {
      width: "50%",
      marginLeft: "auto",
      marginRight: "auto",
      [theme.breakpoints.down("md")]: {
        width: "90%",
        padding: "0px",
      },
    },
    media: {
      width: "60%",
      height: "350px",
      marginLeft: "auto",
      marginRight: "auto",
      [theme.breakpoints.down("md")]: {
        width: "90%",
      },
    },
    bg: {
      overflow: "auto",
      "&::-webkit-scrollbar": {
        display: "none",
      },
      width: "100vw",
      height: "100vh",
      position: "absolute",
      top: "0",
      bottom: "0",
      left: "0",
      right: "0",
      background:
        "linear-gradient(rgba(31, 54, 37, 0) 5%,rgba(31, 54, 37, 0.636721) 15%, #1F3625 40%, #e5e5e5 40%)",
    },
    formheader: {
      paddingLeft: "1%",
      [theme.breakpoints.down("md")]: {
        paddingLeft: "5%",
        paddingTop: "5%",
      },
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
    },
    submitDiv: {
      display: "flex",
      // marginLeft:'30px',
      flexDirection: "row",
      marginTop: "10px",
      [theme.breakpoints.down("md")]: {
        marginLeft: "6%",
        marginBottom: "10px",
      },
    },
    span: {
      flexGrow: "0.85",
    },
    input: {
      display: "none",
    },
    helper: {
      width: "90%",
      paddingLeft: "1%",
      textAlign: "left",
      [theme.breakpoints.down("md")]: {
        paddingLeft: "5%",
        textAlign: "center",
      },
    },
    images: {
      display: "flex",
      justifyContent: "center",
    },
    submitbtn: {
      marginTop: "20px",
      marginLeft: "auto",
      marginRight: "auto",
      marginBottom: "10px",
      display: "block",
    },
  })
);
