/* eslint-disable array-callback-return */
import { useEffect, useState, useCallback } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useRecoilState } from "recoil";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import imageCompression from "browser-image-compression";

import { Spinner } from "../../components/Spinner";
import { GiftDialog } from "./GiftDialog";
import { PwdDialog } from "./PwdDialog";
import { ShareDialog } from "./ShareDialog";
import Axios from "../../api/local";
import tree from "../../assets/dark_logo.png";
import bgfooter from "../../assets/gift/bgfooter.png";
import footer from "../../assets/gift/footer.png";
import { albums } from "../../store/adminAtoms";
import { Albums } from "./Albums";
import { useAppDispatch } from "../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as userTreeActions from "../../redux/actions/userTreeActions";

const intitialFValues = {
  name: "",
  email: "",
  contact: "",
  saplingid: "",
  uploaded: false,
  loading: true,
  backdropOpen: false,
  dlgOpen: false,
  selectedSaplingId: 0,
  selectedTreeImg: "",
  selectedTreeImgDlg: false,
  selectedPlotId: "",
  user: {},
  trees: [],
  filteredTrees: [],
  selectedTreeSum: 0,
  pwdDlgOpen: false,
  shareDlgOpen: false,
  shareName: "",
  shareTree: "",
  shareTreeId: "",
};

export const GiftTrees = () => {
  let { email, group_id } = useParams();

  const dispatch = useAppDispatch();
  const { assignTrees, unassignUserTrees } = bindActionCreators(
    userTreeActions,
    dispatch
  );

  const classes = useStyles();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [values, setValues] = useState(intitialFValues);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState("all");
  const [al, setAlbums] = useRecoilState(albums);
  const [assignedSelected, setAssignedSelected] = useState(false);
  const [unassignedSelected, setUnassignedSelected] = useState(false);
  const [unAssignModalOpen, setUnAssignModalOpen] = useState(false);
  const [searchStr, setSearchStr] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {

      setValues(prev => {

        let filteredTrees = 
          filter === "all"
          ? values.trees
          : filter === "assigned"
            ? values.trees.filter((item) => {
                return item.assigned_to;
              })
            : values.trees.filter((item) => {
                return !item.assigned_to;
              });
        
        if (searchStr.trim() !== '') {
            filteredTrees = filteredTrees.filter(item => {
              return item.sapling_id.includes(searchStr);
            });
        }

        return {
          ...prev,
          filteredTrees,
        }
      })
    }, 300)

    return () => {
      clearTimeout(handler);
    }
  }, [searchStr, filter])

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    if (event.target.value === "all") {
      setValues({
        ...values,
        filteredTrees: values.trees,
      });
    } else if (event.target.value === "assigned") {
      let temp = values.trees.filter((item) => {
        return item.assigned_to;
      });
      setValues({
        ...values,
        filteredTrees: temp,
      });
    } else if (event.target.value === "unassigned") {
      let temp = values.trees.filter((item) => {
        return !item.assigned_to;
      });
      setValues({
        ...values,
        filteredTrees: temp,
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const compressImageList = async (file) => {
    const options = {
      maxSizeMB: 2.5,
      maxWidthOrHeight: 1920,
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
  const handleClickOpen = () => {
    setValues({
      ...values,
      dlgOpen: true,
    });
  };

  const handlePwdDlgClose = () => {
    setValues({
      ...values,
      pwdDlgOpen: false,
    });
  };

  const handleShareDlgClose = () => {
    setValues({
      ...values,
      shareDlgOpen: false,
    });
  };

  const handleClose = () => {
    setValues({
      ...values,
      dlgOpen: false,
    });
  };

  const handleFormData = async (
    formData,
    img,
    albumName,
    selfAssign = false,
    sponsorUser,
    sponsorGroup,
    visited,
  ) => {
    let images = [];
    if (albumName !== "none") {
      images = al.filter((album) => {
        return album.album_name === albumName;
      })[0].images;
    }
    await assignTrees2(formData, img, images, selfAssign, sponsorUser, sponsorGroup, visited);
    setUnassignedSelected(false);
    setAssignedSelected(false);
  };

  const fetchTrees = useCallback(async () => {
    try {
      let profileTrees;
      if (email) profileTrees = await Axios.get(`/mapping/${email}`);
      else profileTrees = await Axios.get(`/mapping/group/${group_id}`);
      if (profileTrees.status === 200) {
        let data = profileTrees.data.trees.results;
        data = data.map((tree) => ({ ...tree, selected: false }));
        setValues((values) => {
          return {
            ...values,
            user: profileTrees.data.user,
            trees: data,
            filteredTrees: data,
          };
        });
      }

      if (email) {
        let albums = await Axios.get(`/albums/${email}`);
        if (albums.status === 200) {
          setAlbums(albums.data.albums);
        }
      }

      setValues((values) => {
        return {
          ...values,
          loading: false,
        };
      });
    } catch (error) {
      console.error(error);
      if (error.response?.status === 404) {
        setValues((values) => {
          return {
            ...values,
            loading: false,
            backdropOpen: false,
          };
        });
        toast.error(error.response?.data?.message);
      }
    }
  }, [email, setAlbums]);

  useEffect(() => {
    (async () => {
      await fetchTrees();
    })();
    document.title = "14Trees Dashboard - Assign Trees";
  }, [fetchTrees]);

  const handleSaplingClick = () => {
    navigate("/profile/" + values.shareTreeId);
  };

  const download = (type) => {
    setValues({
      ...values,
      loading: true,
    });
    const params = JSON.stringify({
      sapling_id: values.shareTreeId,
      tree_name: values.shareTree,
      name: values.shareName,
      type: type === "1" ? "bd" : "hny",
    });
    try {
      Axios.post("/templates/", params, {
        responseType: "arraybuffer",
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((img) => {
          const file = new Blob([img.data], { type: "image/png" });
          return file;
        })
        .then((blob) => {
          let url = window.URL.createObjectURL(blob);
          let link = document.createElement("a");
          link.href = url;
          link.download = values.shareName;
          link.click();
        });
      setValues({
        ...values,
        loading: false,
      });
      toast.success("Image downloaded successfully!");
    } catch (error) {
      setValues({
        ...values,
        loading: false,
      });
      if (error.response.status === 500) {
        toast.error(error.response.data.error);
      } else if (error.response.status === 409) {
        toast.error(error.response.data.error);
      }
    }
  };

  const assignTrees2 = async (formValues, img, images, selfAssign, sponsorUser, sponsorGroup, visited) => {
    setValues({
      ...values,
      loading: true,
      backdropOpen: true,
    });

    const formData = new FormData();
    let sapling_ids = values.filteredTrees
      .filter((t) => t.selected === true)
      .map((a) => a.sapling_id);
    const date = moment(formValues.dob).format("YYYY-MM-DD");
    if (selfAssign) {
      formData.append("name", values.user.name);
      formData.append("email", values.user.email);
      formData.append("phone", values.user.contact);
    } else {
      formData.append("name", formValues.name);
      formData.append("email", formValues.email);
      formData.append("phone", formValues.contact);
    }

    formData.append("birth_date", date);
    formData.append("sapling_ids", sapling_ids);
    formData.append("visited", visited);
    if (sponsorUser && sponsorUser.id) formData.append("sponsored_by_user", sponsorUser.id);
    if (sponsorGroup && sponsorGroup.id) formData.append("sponsored_by_group", sponsorGroup.id);

    if (formValues.gifted_by && formValues.gifted_by !== "undefined")
      formData.append("gifted_by", formValues.gifted_by);
    if (formValues.planted_by && formValues.planted_by !== "undefined")
      formData.append("planted_by", formValues.planted_by);
    if (formValues.desc && formValues.desc !== "undefined")
      formData.append("description", formValues.desc);
    if (formValues.type !== "") formData.append("type", formValues.type);
    if (images.length > 0) formData.append("album_images", images);
    if (img !== null) {
      let image = await compressImageList(img);
      formData.append("files", image);
      formData.append("user_image", img.name);
    }

    assignTrees(formData);

    let profileTrees = await Axios.get(`/mapping/${email}`);
    if (profileTrees.status === 200 || profileTrees.status === 304) {
      setValues((values) => ({
        ...values,
        loading: false,
        user: profileTrees.data.user,
        trees: profileTrees.data.trees?.results?.map((t) => ({
          ...t,
          selected: false,
        })),
        filteredTrees: profileTrees.data.trees?.results?.map((t) => ({
          ...t,
          selected: false,
        })),
        selectedTreeSum: 0,
        dlgOpen: false,
        uploaded: true,
      }));
    }
  };

  const handleDeleteAlbum = async (selectedAlbum) => {
    setValues({
      ...values,
      loading: true,
      backdropOpen: true,
    });
    try {
      let res = await Axios.delete(`/albums/${selectedAlbum.id}`, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      if (res.status === 200) {
        let albums = await Axios.get(`/albums/${email}`);
        if (albums.status === 200) {
          setAlbums(albums.data.albums);
        }
        setValues({
          ...values,
          loading: false,
        });
        toast.success("Album deleted successfully!");
      }
    } catch (error) {
      setValues({
        ...values,
        loading: false,
        backdropOpen: false,
      });
      toast.error(error.response.data.error);
    }
  };

  const handleCreateAlbum = async (album_name, files) => {
    setValues({
      ...values,
      loading: true,
      backdropOpen: true,
    });
    const formData = new FormData();
    formData.append("album_name", album_name);
    formData.append("name", values.user.name);
    const imagesNames = [];
    if (files) {
      for (const key of Object.keys(files)) {
        let image = await compressImageList(files[key]);
        formData.append("images", image);
        imagesNames.push(files[key].name);
      }
    }
    formData.append("file_names", imagesNames);
    try {
      let res = await Axios.post(`/albums/${email}`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        let albums = await Axios.get(`/albums/${email}`);
        if (albums.status === 200) {
          setAlbums(albums.data.albums);
        }
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

  const handleSelectTrees = (event, value) => {
    values.filteredTrees.forEach((item, index) => {
      if (item.sapling_id === value.sapling_id) {
        item.selected = !value.selected;
      }
    });

    // Calculate the sum of selected trees
    const sum = values.filteredTrees
      .map((item) => item.selected)
      .reduce((prev, curr) => prev + curr, 0);

    // Update state variables based on whether the selected tree is assigned or unassigned
    setUnassignedSelected(
      values.filteredTrees.some((item) => item.selected && !item.assigned_to)
    );
    setAssignedSelected(
      values.filteredTrees.some((item) => item.selected && item.assigned_to)
    );

    setValues({
      ...values,
      selectedTreeSum: sum,
    });
  };

  const handleSelectAlltree = (event) => {
    values.filteredTrees.forEach((item, index) => {
        item.selected = event.target.checked;
    });

    // Calculate the sum of selected trees
    const sum = values.filteredTrees
      .map((item) => item.selected)
      .reduce((prev, curr) => prev + curr, 0);

    // Update state variables based on whether the selected tree is assigned or unassigned
    setUnassignedSelected(
      values.filteredTrees.some((item) => item.selected && !item.assigned_to)
    );
    setAssignedSelected(
      values.filteredTrees.some((item) => item.selected && item.assigned_to)
    );

    setValues({
      ...values,
      selectedTreeSum: sum,
    });
  };

  const handleUnassignTrees = async (event) => {
    event.preventDefault();
    setUnAssignModalOpen(false);

    let sapling_ids = values.filteredTrees
      .filter((t) => t.selected === true)
      .map((a) => a.sapling_id);

    const removedSelected = values.filteredTrees.map((t) => ({
      ...t,
      selected: false,
    }));
    setValues({
      ...values,
      filteredTrees: removedSelected,
      selectedTreeSum: 0,
    });

    await unassignUserTrees(sapling_ids);
    await fetchTrees();
    setUnassignedSelected(false);
    setAssignedSelected(false);
  };

  const handleTreeImgClick = (img) => {
    setValues({
      ...values,
      selectedTreeImg: img,
      selectedTreeImgDlg: !values.selectedTreeImgDlg,
    });
  };

  if (values.loading) {
    return <Spinner />;
  } else {
    if ((!group_id && (!values.user || Object.keys(values.user).length === 0)) && !values.loading) {
      return (
        <Typography
          variant="h2"
          align="center"
          sx={{ p: 8, fontWeight: "bold" }}
        >
          User ID not found!
        </Typography>
      );
    } else {
      return (
        <>
          <PwdDialog
            open={values.pwdDlgOpen}
            onClose={handlePwdDlgClose}
            passwd={"admin@14trees"}
          />
          <Dialog
            open={values.selectedTreeImgDlg}
            onClose={() =>
              setValues({
                ...values,
                selectedTreeImgDlg: !values.selectedTreeImgDlg,
              })
            }
          >
            <DialogContent
              sx={{
                p: 2,
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {values.selectedTreeImg !== "" ? (
                  <img
                    src={values.selectedTreeImg}
                    alt="album"
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "720px",
                      paddingBottom: "16px",
                    }}
                  />
                ) : (
                  <div></div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <div className={classes.bg}>
            {/* <Box
              sx={{
                textAlign: "center",
                p: 6,
                "@media screen and (max-width: 640px)": {
                  p: 2,
                },
              }}
            >
              <img src={logo} className={classes.logo} alt="logoo" />
              <div className={classes.headerbox}>
                <Typography
                  variant="h5"
                  align="center"
                  sx={{ color: "#1f3625", fontWeight: "550" }}
                >
                  <span>
                    Thank You {values.user.name} for your generous donation to
                    the 14 Trees Foundation and for supporting the efforts in
                    building sustainable, carbon-footprint-neutral eco-systems
                    through re-forestation.
                  </span>
                </Typography>
                <Typography
                  variant="subtitle1"
                  align="left"
                  sx={{
                    lineHeight: "25px",
                    fontSize: "20px",
                    color: "#1f3625",
                    pt: 6,
                    pb: 3,
                  }}
                >
                  Your generous support is helping us will plant more trees to
                  combat the effects of environmental degradation and climate
                  change as well as support projects on habitat restoration,
                  groundwater recharging, biodiversity experiments, and also
                  provide a livelihood for local tribal villagers.
                </Typography>
                <Typography
                  align="left"
                  sx={{
                    lineHeight: "25px",
                    fontSize: "20px",
                    color: "#1f3625",
                    pb: 3,
                  }}
                >
                  The following trees have been planted as a result of your
                  support which you can assign to your family members, friends,
                  and loved ones by following the steps mentioned here.
                </Typography>
                <Typography
                  align="left"
                  sx={{
                    lineHeight: "25px",
                    fontSize: "20px",
                    color: "#1f3625",
                    pb: 3,
                  }}
                >
                  Once again, thank you for your support.
                </Typography>
                <Typography
                  align="left"
                  sx={{
                    lineHeight: "25px",
                    fontSize: "20px",
                    fontWeight: "500",
                    color: "#1f3625",
                    pb: 3,
                  }}
                >
                  Thank You,
                  <div style={{ margin: "0px", fontWeight: "bold" }}>
                    Team, 14Trees Foundation
                  </div>
                </Typography>
              </div>
            </Box> */}
            <div style={{ position: "relative" }}>
              {/* <img src={bg} className={classes.landingimg} alt="bg" /> */}
              <div
                style={{
                  background:
                    "linear-gradient(360deg, #3F5344 17.02%, rgba(63, 83, 68, 0) 100%)",
                  height: "230px",
                  position: "relative",
                  zIndex: "999",
                  marginTop: "-200px",
                }}
              ></div>
              <img src={bgfooter} className={classes.bgfooter} alt="bgfooter" />
            </div>
            <GiftDialog
              open={values.dlgOpen}
              onClose={handleClose}
              formData={handleFormData}
            />
            <div className={classes.itembox}>
              <Albums
                handleCreateAlbum={handleCreateAlbum}
                handleDeleteAlbum={handleDeleteAlbum}
                setAlbums={setAlbums}
              />
            </div>
            <div className={classes.itembox} style={{ paddingTop: "32px" }}>
              <Box>
                <Typography
                  variant="h4"
                  align="left"
                  sx={{
                    pl: 1,
                    pt: 4,
                    pb: 4,
                    fontWeight: "600",
                    color: "#1f3625",
                  }}
                >
                  Tree Holdings ( {values.trees.length} )
                </Typography>
                <FormControl
                  component="fieldset"
                  sx={{ alignSelf: "center", pl: 2 }}
                >
                  <RadioGroup
                    row
                    aria-label="assigned"
                    onChange={handleFilterChange}
                    value={filter}
                  >
                    <FormControlLabel
                      value="all"
                      control={<Radio />}
                      label="All"
                    />
                    <FormControlLabel
                      value="assigned"
                      control={<Radio />}
                      label="Assigned"
                    />
                    <FormControlLabel
                      value="unassigned"
                      control={<Radio />}
                      label="Un-Assigned"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
              <ToastContainer />
              {tree.length === 0 && (
                <Typography
                  variant="h5"
                  align="left"
                  sx={{ pl: 4, pt: 2, pb: 2 }}
                >
                  No Trees in your account
                </Typography>
              )}
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="sapling_id">Search sapling ID</InputLabel>
                  <OutlinedInput
                    // id="sapling_id"
                    value={searchStr}
                    label="Search sapling id"
                    onChange={(e) => { setSearchStr(e.target.value) }}
                  />
                </FormControl>
              </Box>
              <TableContainer>
                <Table sx={{ minWidth: 360 }} aria-label="simple table">
                  <TableHead>
                    <TableRow sx={{ fontSize: "16px" }}>
                      {/* <TableCell align="right"></TableCell> */}
                      <TableCell align="left"><Checkbox checked={values.filteredTrees.every(item => item.selected)} onClick={(e) => handleSelectAlltree(e)} /></TableCell>
                      <TableCell align="right"></TableCell>
                      <TableCell>Tree Name</TableCell>
                      <TableCell align="center">Sapling ID</TableCell>
                      <TableCell align="center">Plot</TableCell>
                      <TableCell align="right">
                        <Button
                          sx={{ ml: "auto", mr: "auto" }}
                          variant="contained"
                          color="primary"
                          disabled={
                            values.selectedTreeSum <= 0 || unassignedSelected
                          }
                          onClick={() => setUnAssignModalOpen(true)}
                        >
                          UnAssign
                        </Button>
                      </TableCell>
                      {/* <TableCell align="right"></TableCell> */}
                      <TableCell>
                        <Button
                          sx={{ ml: "auto", mr: "auto" }}
                          variant="contained"
                          color="primary"
                          disabled={
                            values.selectedTreeSum <= 0 || assignedSelected
                          }
                          onClick={handleClickOpen}
                        >
                          Assign
                        </Button>
                      </TableCell>
                      <Dialog
                        open={unAssignModalOpen}
                        onClose={() => setUnAssignModalOpen(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        {/* <DialogTitle id="alert-dialog-title">{"Unassign Trees"}</DialogTitle> */}
                        <Box p={2}>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                              Are you sure you want to unAssign the selected
                              trees?
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Box
                              display="flex"
                              justifyContent="center"
                              width="100%"
                            >
                              <Button
                                variant="contained"
                                onClick={() => setUnAssignModalOpen(false)}
                                color="primary"
                              >
                                No
                              </Button>
                              <Button
                                variant="contained"
                                onClick={(event) => handleUnassignTrees(event)}
                                color="primary"
                                autoFocus
                                sx={{ marginLeft: "15px" }}
                              >
                                Yes
                              </Button>
                            </Box>
                          </DialogActions>
                        </Box>
                      </Dialog>
                    </TableRow>
                  </TableHead>
                  <TableBody className={classes.tblrow}>
                    {values.filteredTrees
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => (
                        <TableRow
                          key={row.id}
                          sx={{
                            m: 2,
                          }}
                        >
                          <TableCell
                            onClick={(event) => handleSelectTrees(event, row)}
                            align="center"
                          >
                            <Checkbox
                              // disabled={row.type !== null}
                              checked={row.selected}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.image && row.image !== "" && (
                              <img
                                src={row.image}
                                className={classes.treeimg}
                                alt=""
                                onClick={() => handleTreeImgClick(row.image)}
                              />
                            )}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.plant_type}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ cursor: "pointer" }}
                          >
                            {row.sapling_id}
                          </TableCell>
                          <TableCell align="center">{row.plot}</TableCell>
                          <TableCell align="center">
                            {row.assigned_to ? (
                              <>
                                <Typography
                                  variant="subtitle2"
                                  align="center"
                                  sx={{ p: 1, pb: 0, fontSize: "12px" }}
                                >
                                  Assigned To
                                </Typography>
                                <Typography
                                  variant="subtitle1"
                                  align="center"
                                  sx={{ fontWeight: "bold", color: "#1F3625" }}
                                >
                                  {row.assigned_to}
                                </Typography>
                              </>
                            ) : (
                              <></>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {/* <Button
                              sx={{ ml: "auto", mr: "auto" }}
                              variant="contained"
                              color="primary"
                              disabled={!row.user}
                              onClick={() =>
                                handleShare(
                                  row.sapling_id,
                                  row.tree.name,
                                  row.user.name
                                )
                              }
                            >
                              Card
                            </Button> */}
                            <Button
                              sx={{ ml: "auto", mr: "auto" }}
                              variant="contained"
                              color="primary"
                              disabled={!row.assigned_to}
                              onClick={() =>
                                window.open(
                                  `/profile/${row.sapling_id}`,
                                  "_blank",
                                  "noopener,noreferrer"
                                )
                              }
                            >
                              Dashboard
                            </Button>
                          </TableCell>
                          {/* <TableCell align="center">
                                                            {
                                                                (row.type !== undefined && row.type !== "" && row.type === "2") && (
                                                                    <Button
                                                                        sx={{ ml: 'auto', mr: 'auto' }}
                                                                        variant="contained"
                                                                        color='primary'
                                                                        disabled={!row.assigned && row.type !== null}
                                                                        onClick={() => handleTemplateShare(row.type, row.link)}
                                                                    >
                                                                        Share
                                                                    </Button>
                                                                )
                                                            }
                                                        </TableCell> */}
                          <ShareDialog
                            open={values.shareDlgOpen}
                            onClose={handleShareDlgClose}
                            submit={download}
                            handleClick={() => handleSaplingClick(row)}
                          />
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={values.filteredTrees.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
            <div className={classes.footer}></div>
          </div>
        </>
      );
    }
  }
};

const useStyles = makeStyles((theme) =>
  createStyles({
    bg: {
      backgroundColor: "#E9EAE7",
      width: "100%",
    },
    logo: {
      width: "90px",
      height: "110px",
      padding: theme.spacing(2),
    },
    headerbox: {
      width: "80%",
      maxWidth: "920px",
      marginLeft: "auto",
      marginRight: "auto",
      [theme.breakpoints.down("md")]: {
        width: "100%",
      },
    },
    landingimg: {
      width: "100%",
      height: "auto",
      marginTop: "-250px",
      [theme.breakpoints.down("1200")]: {
        marginTop: "-80px",
        minHeight: "350px",
      },
    },
    bgfooter: {
      width: "100%",
      height: "90px",
      marginTop: "-5px",
      [theme.breakpoints.down("1200")]: {
        height: "50px",
      },
    },
    itembox: {
      maxWidth: "1080px",
      marginLeft: "auto",
      marginRight: "auto",
      paddingBottom: theme.spacing(10),
      paddingTop: theme.spacing(12),
      [theme.breakpoints.down("1200")]: {
        padding: "32px 8px 48px 8px",
      },
    },
    left: {
      width: "100%",
      marginRight: "10px",
    },
    center: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    right: {
      width: "100%",
      marginLeft: "10px",
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
    infodesc: {
      fontSize: "30px",
      paddingLeft: "1%",
      fontWeight: "500",
      color: "#ffffff",
      alignItems: "center",
      textAlign: "center",
      [theme.breakpoints.down("md")]: {
        fontSize: "20px",
      },
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
    },
    tblrow: {
      "& .MuiTableCell-root": {
        padding: "16px",
      },
      "& .MuiTableRow-root": {
        fontSize: "20px",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
      },
    },
    footer: {
      marginTop: "48px",
      backgroundImage: `url(${footer})`,
      height: "245px",
      width: "auto",
    },
    treeimg: {
      width: "50px",
      height: "50px",
      borderRadius: "25px",
      cursor: "pointer",
    },
  })
);
