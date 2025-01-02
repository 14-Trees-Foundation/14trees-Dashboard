import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Slide,
  Button,
  TextField,
  MenuItem,
  Select,
  Checkbox,
  FormControlLabel,
  Grid,
  Box,
} from "@mui/material";
import { Field, Form } from "react-final-form";
import { makeStyles } from "@mui/styles";
import Dropzone from "react-dropzone";
import { useState, useEffect } from "react";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop from "react-image-crop";
import { useRecoilValue } from "recoil";

import { albums } from "../../store/adminAtoms";
import { useAppDispatch, useAppSelector } from "../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as userActionCreators from '../../redux/actions/userActions'
import * as groupActionCreators from '../../redux/actions/groupActions'
import * as visitActionCreators from '../../redux/actions/visitActions'
import { AutocompleteWithPagination } from "../../components/AutoComplete";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const GiftDialog = (props) => {
  const classes = useStyles();
  const { onClose, open, formData } = props;
  const [croppedImg, setCroppedImg] = useState(null);
  const [selfAssign, setSelfAssign] = useState(false);
  const [imgsrc, setImgsrc] = useState(null);
  const [cropImgsrc, setCropImgsrc] = useState(null);
  const [imageRef, setImageRef] = useState();
  const albumsData = useRecoilValue(albums);
  const [selAlbum, setSelAlbumName] = useState("none");
  const [template, setTemplate] = useState("");
  const templates = [
    {
      name: "Birthday",
      value: "1",
    },
    {
      name: "In Memory of",
      value: "2",
    },
    {
      name: "General gift",
      value: "3",
    },
    {
      name: "Corporate gift",
      value: "4",
    },
  ];
  const [crop, setCrop] = useState(
    // default crop config
    {
      unit: "%",
      width: 30,
      aspect: 9 / 11,
    }
  );
  async function cropImage(crop) {
    let random = Math.random().toString(36).substr(2, 5);
    if (imageRef && crop.width && crop.height) {
      const croppedImage = await getCroppedImg(
        imageRef,
        crop,
        "croppedImage" + random + ".jpeg" // destination filename
      );

      // calling the props function to expose
      setCroppedImg(croppedImage);
      setCropImgsrc(croppedImage ? URL.createObjectURL(croppedImage) : null);
    }
  }

  const getCroppedImg = (imageFile, pixelCrop, fileName) => {
    const canvas = document.createElement("canvas");

    const scaleX = imageFile.naturalWidth / imageFile.width;
    const scaleY = imageFile.naturalHeight / imageFile.height;
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      imageFile,
      pixelCrop.x * scaleX,
      pixelCrop.y * scaleY,
      pixelCrop.width * scaleX,
      pixelCrop.height * scaleY,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          // returning an error
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }

          blob.name = fileName;

          resolve(blob);
        },
        "image/jpeg",
        1
      );
    });
  };

  const handleClose = () => {
    onClose();
  };

  const handleAlbumChange = (e) => {
    setSelAlbumName(e.target.value);
  };

  const handleTemplateChange = (e) => {
    setTemplate(e.target.value);
  };

  const handleProfilePic = (image) => {
    setImgsrc(image ? URL.createObjectURL(image[0]) : null);
  };

  ///*** Sponsor user ***/
  const [suPage, setSUPage] = useState(0);
  const [suLoading, setSULoading] = useState(false);
  const [sponsorSearch, setSponsorSearch] = useState('');
  const [selectedSponsorUser, setSelectedSponsorUser] = useState(null);

  const dispatch = useAppDispatch();
  const { getUsers } = bindActionCreators(userActionCreators, dispatch);

  useEffect(() => {
    getUsersData(suPage, sponsorSearch);
  }, [suPage, sponsorSearch]);

  const getUsersData = async (page, search) => {
    const userNameFilter = {
      columnField: "name",
      value: search,
      operatorValue: "contains",
    };

    setSULoading(true);
    getUsers(page * 10, 10, [userNameFilter]);
    setTimeout(async () => {
      setSULoading(false);
    }, 1000);
  };

  let usersList = [];
  const usersData = useAppSelector((state) => state.usersData);
  if (usersData) {
    usersList = Object.values(usersData.users);
    usersList = usersList.sort((a, b) => {
      return b.id - a.id;
    });
  }

  ///*** Visits ***/
  const [visited, setVisited] = useState(false);
  // const [visitsPage, setVisitsPage] = useState(0);
  // const [visitsLoading, setVisitsLoading] = useState(false);
  // const [visitSearch, setVisitSearch] = useState('');
  // const [selectedVisit, setSelectedVisit] = useState(null);
  // const { getVisits } = bindActionCreators(visitActionCreators, dispatch);

  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     getVisitsData(visitsPage, visitSearch);
  //   }, 300);

  //   return () => {
  //     clearTimeout(handler);
  //   }
  // }, [visitsPage, visitSearch]);

  // const getVisitsData = async (page, search) => {
  //   const groupNameFilter = {
  //     columnField: "visit_name",
  //     value: search,
  //     operatorValue: "contains",
  //   };

  //   setVisitsLoading(true);
  //   getVisits(page * 10, 10, [groupNameFilter]);
  //   setTimeout(async () => {
  //     setVisitsLoading(false);
  //   }, 1000);
  // };

  // let visitsList = [];
  // const visitsData = useAppSelector((state) => state.visitsData);
  // if (visitsData) {
  //   visitsList = Object.values(visitsData.visits);
  //   visitsList = visitsList.sort((a, b) => {
  //     return b.id - a.id;
  //   });
  // }


  ///*** Sponsor Group ***/
  const [sgPage, setSGPage] = useState(0);
  const [sgLoading, setSGLoading] = useState(false);
  const [sponsorGroupSearch, setSponsorGroupSearch] = useState('');
  const [selectedSponsorGroup, setSelectedSponsorGroup] = useState(null);

  const { getGroups } = bindActionCreators(groupActionCreators, dispatch);

  useEffect(() => {
    const handler = setTimeout(() => {
      getGroupsData(sgPage, sponsorGroupSearch);
    }, 300);

    return () => {
      clearTimeout(handler);
    }
  }, [sgPage, sponsorGroupSearch]);

  const getGroupsData = async (page, search) => {
    const groupNameFilter = {
      columnField: "name",
      value: search,
      operatorValue: "contains",
    };

    setSGLoading(true);
    getGroups(page * 10, 10, [groupNameFilter]);
    setTimeout(async () => {
      setSGLoading(false);
    }, 1000);
  };

  let groupsList = [];
  const groupsData = useAppSelector((state) => state.groupsData);
  if (groupsData) {
    groupsList = Object.values(groupsData.groups);
    groupsList = groupsList.sort((a, b) => {
      return b.id - a.id;
    });
  }


  ///*** FORM SUBMIT ***/
  const formSubmit = (formValues) => {
    onClose();
    formValues["type"] = template;
    formData(formValues, croppedImg, selAlbum, selfAssign, selectedSponsorUser, selectedSponsorGroup, visited);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <div className={classes.title}>Gift this tree</div>
      </DialogTitle>
      <DialogContent>
        <Form
          onSubmit={formSubmit}
          validate={(values) => {
            const errors = {};
            if (!selfAssign) {
              if (!values.name) {
                errors.name = "Name is required.";
              }
              if (!values.email) {
                errors.email = "Email required.";
              }
            }
            return errors;
          }}
          render={({ handleSubmit, form, submitting, pristine }) => (
            <form
              onSubmit={handleSubmit}
              className={classes.root}
              autoComplete="off"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selfAssign}
                    onChange={(e) => {
                      setSelfAssign(e.target.checked);
                    }}
                  />
                }
                label="I'm assigning to myself"
              />
              {!selfAssign && (
                <>
                  <Field name="name">
                    {({ input, meta }) => (
                      <TextField
                        error={meta.error && meta.touched ? true : false}
                        {...input}
                        variant="outlined"
                        label="Full Name *"
                        name="name"
                        fullWidth
                        sx={{ mb: 2, mt: 1 }}
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
                        fullWidth
                        error={meta.error && meta.touched ? true : false}
                        {...input}
                        sx={{ mb: 2 }}
                        helperText={
                          meta.error && meta.touched ? meta.error : ""
                        }
                      />
                    )}
                  </Field>
                  <Field name="contact">
                    {({ input, meta }) => (
                      <TextField
                        variant="outlined"
                        label="Contact"
                        name="contact"
                        fullWidth
                        error={meta.error && meta.touched ? true : false}
                        {...input}
                        sx={{ mb: 2 }}
                        helperText={
                          meta.error && meta.touched ? meta.error : ""
                        }
                      />
                    )}
                  </Field>
                </>
              )}
              <Box mb={1}>
                <AutocompleteWithPagination
                  name="sponsor_url"
                  label="Select a sponsor user"
                  options={usersList}
                  getOptionLabel={(option) => `${option.name} (${option.email})`}
                  isOptionEqualToValue={(option, value) => {
                    return option.id === value.id;
                  }}
                  onChange={(event, newValue) => {
                    setSelectedSponsorUser(newValue);
                  }}
                  onInputChange={(event) => {
                    const { value } = event.target;
                    setSUPage(0);
                    setSponsorSearch(value);
                  }}
                  setPage={setSUPage}
                  loading={suLoading}
                  fullWidth
                  size="medium"
                />
              </Box>
              <Box mb={2}>
                <AutocompleteWithPagination
                  name="sponsor_group"
                  label="Select a sponsor group"
                  options={groupsList}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => {
                    return option.id === value.id;
                  }}
                  onChange={(event, newValue) => {
                    setSelectedSponsorGroup(newValue);
                  }}
                  onInputChange={(event) => {
                    const { value } = event.target;
                    setSGPage(0);
                    setSponsorGroupSearch(value);
                  }}
                  setPage={setSGPage}
                  loading={sgLoading}
                  fullWidth
                  size="medium"
                />
              </Box>
              <Field name="planted_by">
                {({ input, meta }) => (
                  <TextField
                    variant="outlined"
                    label="Planted By"
                    name="planted_by"
                    fullWidth
                    {...input}
                    sx={{ mb: 2 }}
                  />
                )}
              </Field>
              <Field name="desc">
                {({ input, meta }) => (
                  <TextField
                    variant="outlined"
                    label="Description/Event Name"
                    name="desc"
                    fullWidth
                    {...input}
                    sx={{ mb: 2 }}
                  />
                )}
              </Field>
              <Select
                fullWidth
                onChange={handleAlbumChange}
                defaultValue="none"
              >
                <MenuItem disabled value="none">
                  Select Album
                </MenuItem>
                {albumsData?.map((option) => {
                  return (
                    <MenuItem key={option.album_name} value={option.album_name}>
                      {option.album_name}
                    </MenuItem>
                  );
                })}
              </Select>
              <Select
                sx={{ mt: 2 }}
                fullWidth
                onChange={handleTemplateChange}
                defaultValue="none"
              >
                <MenuItem disabled value="none">
                  Select Template
                </MenuItem>
                {templates?.map((option) => {
                  return (
                    <MenuItem key={option.value} value={option.value}>
                      {option.name}
                    </MenuItem>
                  );
                })}
              </Select>
              <Box mb={2} mt={1}>
                {/* <AutocompleteWithPagination
                  name="visit"
                  label="Select a visit"
                  options={visitsList}
                  getOptionLabel={(option) => option.visit_name}
                  isOptionEqualToValue={(option, value) => {
                    return option.id === value.id;
                  }}
                  onChange={(event, newValue) => {
                    setSelectedVisit(newValue);
                  }}
                  onInputChange={(event) => {
                    const { value } = event.target;
                    setVisitsPage(0);
                    setVisitSearch(value);
                  }}
                  setPage={setVisitsPage}
                  loading={visitsLoading}
                  fullWidth
                  size="medium"
                /> */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={visited}
                      onChange={(e) => {
                        setVisited(e.target.checked);
                      }}
                    />
                  }
                  label="Tree(s) Planted during a visit"
                />
              </Box>
              <Field name="profile">
                {({ input, meta }) => (
                  <div className={classes.imgdiv}>
                    <Dropzone
                      onDrop={(acceptedFiles) =>
                        handleProfilePic(acceptedFiles)
                      }
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p style={{ cursor: "pointer" }}>
                              Upload profile pic. Click or Drag!
                            </p>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>
                )}
              </Field>
              {imgsrc !== null && (
                <>
                  <ReactCrop
                    src={imgsrc}
                    crop={crop}
                    onImageLoaded={(imageRef) => setImageRef(imageRef)}
                    onComplete={(cropConfig) => cropImage(cropConfig)}
                    onChange={(c) => setCrop(c)}
                  />
                  <div style={{ width: "100%", textAlign: "center" }}>
                    <img
                      src={cropImgsrc}
                      className={classes.img2}
                      alt="profile"
                    />
                  </div>
                </>
              )}
              <div className={classes.actions}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={submitting}
                  type="submit"
                >
                  Gift
                </Button>
              </div>
            </form>
          )}
        />
      </DialogContent>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: "23px",
    fontWeight: "400",
    color: "#312F30",
    textAlign: "center",
    margin: theme.spacing(4),
  },
  formtitle: {
    color: "#312F30",
    fontSize: "14px",
    fontWeight: "600",
    lineHeight: "20px",
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
  actions: {
    "& .MuiDialogActions-root": {
      display: "block",
      paddingBottom: theme.spacing(3),
    },
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(3),
    paddingLeft: theme.spacing(4),
    "& .MuiButton-root": {
      minWidth: "100%",
      maxWidth: "100%",
      minHeight: "6vh",
    },
  },
  imgdiv: {
    padding: "8px",
    marginTop: "8px",
    marginBottom: "8px",
    border: "1px #1f3625 dashed",
    textAlign: "center",
  },
  img2: {
    width: "200px",
    height: "200px",
    ObjectFit: "cover",
  },
}));
