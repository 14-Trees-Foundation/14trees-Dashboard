import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import TagSelector from "../../../components/TagSelector";
import * as siteActionCreators from "../../../redux/actions/siteActions";
import Site from "../../../types/site";
import { useAppSelector, useAppDispatch } from "../../../redux/store/hooks";
import { getSites } from "../../../redux/actions/siteActions";
import { bindActionCreators } from "redux";
import { AutocompleteWithPagination } from "../../../components/AutoComplete";

function EditPlot({ row, openeditModal, handleCloseModal, editSubmit, tags }) {
  const [sitePage, setSitePage] = useState(0);
  const [siteNameInput, setSiteNameInput] = useState("");
  const [sitesLoading, setSitesLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { getSites } = bindActionCreators(siteActionCreators, dispatch);

  const [formData, setFormData] = useState(row);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    editSubmit(formData);
    handleCloseModal();
  };

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

    sitesList.find((item) => {
      if (formData.site_id === item.id) {
        formData.site_id = item.name_english;
      }
      console.log("site_id", formData.site_id);
    });
  }

  return (
    <Dialog open={openeditModal} onClose={() => handleCloseModal()}>
      <DialogTitle align="center">Edit Plot</DialogTitle>
      <form onSubmit={handleEditSubmit}>
        <DialogContent>
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="plot_id"
            label="Plot ID"
            value={formData.plot_id}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
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
          <Autocomplete
            fullWidth
            name="category"
            disablePortal
            options={categoriesList}
            value={formData.category}
            renderInput={(params) => (
              <TextField {...params} margin="dense" label="Category" />
            )}
            onChange={(event, value) => {
              if (categoriesList.includes(value))
                setFormData((prevState) => ({ ...prevState, category: value }));
            }}
          />
          <TextField
            name="gat"
            label="Gat"
            value={formData.gat}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TagSelector
            tagsList={tags}
            value={formData.tags}
            handleChange={(tags) => setFormData({ ...formData, tags: tags })}
            margin="dense"
          />
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "15px",
          }}
        >
          <Button
            variant="contained"
            onClick={() => handleCloseModal()}
            color="primary"
          >
            Cancel
          </Button>
          <Button variant="contained" type="submit" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditPlot;
