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
import CoordinatesInput from "../../../../components/CoordinatesInput";
import { AutocompleteWithPagination } from "../../../../components/AutoComplete";
import * as siteActionCreators from "../../../../redux/actions/siteActions";
import { useAppSelector, useAppDispatch } from "../../../../redux/store/hooks";
import { bindActionCreators } from "redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 300,
  maxWidth: 600,
  minHeight: 450,
  maxHeight: 600,
  overflow: "auto",
  scrollbarWidth: "thin",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
};

const AddPond = ({ open, handleClose, createPondData }) => {
  const [sitePage, setSitePage] = useState(0);
  const [siteNameInput, setSiteNameInput] = useState("");
  const [sitesLoading, setSitesLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { getSites } = bindActionCreators(siteActionCreators, dispatch);
  const [coordinates, setCoordinates] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    tags: [],
    type: "",
    site_id: "",
    length_ft: "",
    width_ft: "",
    depth_ft: "",
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
    const boundaries = {
      type: "Polygon",
      coordinates: [coordinates.map((coord) => [coord.lng, coord.lat])],
    };
    createPondData({
      ...formData,
      boundaries,
    });
    setFormData({
      name: "",
      tags: [],
      type: "",
      site_id: "",
      length_ft: "",
      width_ft: "",
      depth_ft: "",
    });
    handleClose();
  };

  let sitesList = [];
  const siteData = useAppSelector((state) => state.sitesData);

  if (siteData) {
    sitesList = Object.values(siteData.sites);
    console.log("sites list : ", sitesList);
    sitesList = sitesList.sort((a, b) => {
      return b.id - a.id;
    });
  }

  const typesList = ["Storage", "Percolation"];

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "15px",
            }}
            variant="h5"
            component="h2"
          >
            Add Pond
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
                <Autocomplete
                  fullWidth
                  name="type"
                  disablePortal
                  options={typesList}
                  value={formData.type ? formData.type : undefined}
                  renderInput={(params) => (
                    <TextField {...params} margin="dense" label="Type" />
                  )}
                  onChange={(event, value) => {
                    if (value !== "")
                      setFormData((prevState) => ({
                        ...prevState,
                        type: value,
                      }));
                  }}
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
                <TextField
                  name="length_ft"
                  label="Length in Ft"
                  value={formData.length_ft}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="width_ft"
                  label="Width in Ft"
                  value={formData.width_ft}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="depth_ft"
                  label="Depth in Ft"
                  value={formData.depth_ft}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <CoordinatesInput
                  coordinates={coordinates}
                  onChange={setCoordinates}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Button variant="outlined" color="error" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={{ marginLeft: "10px" }}
                  color="success"
                  type="submit"
                >
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

export default AddPond;
