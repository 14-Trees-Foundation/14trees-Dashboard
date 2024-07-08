import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import TagSelector from "../../../components/TagSelector";
import { AutocompleteWithPagination } from "../../../components/AutoComplete";
import * as siteActionCreators from "../../../redux/actions/siteActions";
import Site from "../../../types/site";
import { useAppSelector, useAppDispatch } from "../../../redux/store/hooks";
import { GridFilterItem } from "@mui/x-data-grid";
import { getSites } from "../../../redux/actions/siteActions";
import { bindActionCreators } from "redux";

const AddPlot = ({ open, handleClose, createPlot, tags }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    height: 450,
    overflow: "auto",
    scrollbarWidth: "thin",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    borderRadius: "10px",
    p: 4,
  };
  const [sitePage, setSitePage] = useState(0);
  const [siteNameInput, setSiteNameInput] = useState("");
  const [sitesLoading, setSitesLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { getSites } = bindActionCreators(siteActionCreators, dispatch);
  const [formData, setFormData] = useState({
    name: "",
    plot_id: "",
    site_id: "",
    category: "",
    district: "",
    gat: "",
    land_type: "",
    status: "",
    taluka: "",
    village: "",
    zone: "",
    boundaries: {
      type: "",
      coordinates: [],
    },
    center: {
      type: "",
      coordinates: [],
    },
    __v: 0,
    tags: [],
  });

  useEffect(() => {
    getSitesData();
  }, [sitePage, siteNameInput]);

  const getSitesData = async () => {
    console.log("Fecthing sites data in useEffect");
    const siteNameFilter = {
      columnField: "name_english",
      value: siteNameInput,
      operatorValue: "contains",
    };

    setTimeout(async () => {
      setSitesLoading(true);
      await getSites(sitePage * 10, 10, [siteNameFilter]);
    }, 1000);
    setSitesLoading(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => {
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        return {
          ...prevState,
          [parent]: { ...prevState[parent], [child]: value },
        };
      } else {
        return { ...prevState, [name]: value };
      }
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createPlot(formData);
    setFormData({
      name: "",
      plot_id: "",
      site_id: "",
      category: "",
      district: "",
      gat: "",
      land_type: "",
      status: "",
      taluka: "",
      village: "",
      zone: "",
      boundaries: {
        type: "",
        coordinates: "",
      },
      center: {
        type: "",
        coordinates: "",
      },
      __v: 0,
      tags: [],
    });
    handleClose();
  };

  const categoriesList = ["Public", "Foundation"];

  let sitesList = [];
  const siteData = useAppSelector((state) => state.sitesData);
  console.log("siteData in AddPlot component: ", siteData);
  if (siteData) {
    sitesList = Object.values(siteData.sites);
    console.log("sites list : ", sitesList);
    sitesList = sitesList.sort((a, b) => {
      return b.id - a.id;
    });
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" align="center" sx={{ marginBottom: "8px" }}>
            Add Plot
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container rowSpacing={2} columnSpacing={1}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="plot_id"
                  label="Plot ID"
                  value={formData.plot_id}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <AutocompleteWithPagination
                  name="site"
                  label="Select a Site"
                  options={sitesList}
                  getOptionLabel={(option) => option.name_english}
                  isOptionEqualToValue={(option, value) => {
                    console.log("Option: ", option, "Value: ", value);
                    return option.id === value.id;
                  }}
                  onChange={(event, newValue) => {
                    console.log("on change ", event, newValue);
                    if (newValue !== null) {
                      setFormData((prevState) => {
                        return { ...prevState, ["site_id"]: newValue.id };
                      });
                    }
                  }}
                  onInputChange={(event) => {
                    console.log("on input change ", event);
                    const { value } = event.target;
                    console.log("value from event :  ", event.nativeEvent.data);
                    setSitePage(0);
                    setSiteNameInput(value);
                    handleChange(event);
                  }}
                  setPage={setSitePage}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  fullWidth
                  name="category"
                  disablePortal
                  options={categoriesList}
                  value={formData.category}
                  renderInput={(params) => (
                    <TextField {...params} label="Category" />
                  )}
                  onChange={(event, value) => {
                    if (categoriesList.includes(value))
                      setFormData((prevState) => ({
                        ...prevState,
                        category: value,
                      }));
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="gat"
                  label="Gat"
                  value={formData.gat}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TagSelector
                  tagsList={tags}
                  value={formData.tags}
                  handleChange={(tags) =>
                    setFormData({ ...formData, tags: tags })
                  }
                />
              </Grid>
              {/* <Grid item xs={12}>
                                <TextField name="district" label="District" value={formData.district} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="land_type" label="Land Type" value={formData.land_type} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="status" label="Status" value={formData.status} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="taluka" label="Taluka" value={formData.taluka} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="village" label="Village" value={formData.village} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="zone" label="Zone" value={formData.zone} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="boundaries.type" label="Boundaries Type" value={formData.boundaries.type} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="boundaries.coordinates"
                                    label="Boundaries Coordinates"
                                    value={formData.boundaries.coordinates}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="center.type" label="Center Type" value={formData.center.type} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="center.coordinates"
                                    label="Center Coordinates"
                                    value={formData.center.coordinates}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid> */}
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Button variant="outlined" type="submit">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default AddPlot;
