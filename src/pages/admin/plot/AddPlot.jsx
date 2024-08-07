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
import { useAppSelector, useAppDispatch } from "../../../redux/store/hooks";
import { bindActionCreators } from "redux";

const AddPlot = ({ open, handleClose, createPlot, tags }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: 400,
    maxWidth: 600,
    height: 550,
    overflow: "auto",
    scrollbarWidth: "thin",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    borderRadius: "10px",
    p: 4,
  };

  const [sitePageNo, setSitePageNo] = useState(0);
  const [siteNameInput, setSiteNameInput] = useState("");
  const [sitesLoading, setSitesLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { getSites } = bindActionCreators(siteActionCreators, dispatch);

  const [formData, setFormData] = useState({
    name: "",
    plot_id: "",
    site_id: null,
    category: null,
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
  }, [sitePageNo, siteNameInput]);

  const getSitesData = async () => {
    const siteNameFilter = {
      columnField: "name_english",
      value: siteNameInput,
      operatorValue: "contains",
    };

    setTimeout(async () => {
      setSitesLoading(true);
      await getSites(sitePageNo * 10, 10, [siteNameFilter]);
      setSitesLoading(false);
    }, 100);
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
  if (siteData) {
    sitesList = Object.values(siteData.sites);
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
                  required
                  name="name"
                  label="Name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
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
                    return option.id === value.id;
                  }}
                  onChange={(event, newValue) => {
                    if (newValue !== null) {
                      setFormData((prevState) => {
                        return { ...prevState, ["site_id"]: newValue.id, ["site_name_english"]: newValue.name_english };
                      });
                    }
                  }}
                  onInputChange={(event) => {
                    const { value } = event.target;
                    setSitePageNo(0);
                    setSiteNameInput(value);
                    handleChange(event);
                  }}
                  setPage={setSitePageNo}
                  loading={sitesLoading}
                  fullWidth
                  size="medium"
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
                    <TextField {...params} label="Category" required />
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
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Button variant="outlined" color="error" onClick={handleClose} sx={{ marginRight: "8px" }}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit" color="success">
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
