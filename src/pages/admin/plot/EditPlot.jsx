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
import { useAppSelector, useAppDispatch } from "../../../redux/store/hooks";
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
    const siteNameFilter = {
      columnField: "name_english",
      value: siteNameInput,
      operatorValue: "contains",
    };

    setTimeout(async () => {
      setSitesLoading(true);
      await getSites(sitePage * 10, 10, [siteNameFilter]);
      setSitesLoading(false);
    }, 1000);
  };

  const categoriesList = ["Public", "Foundation"];

  let sitesList = [];
  let sitesMap = {};
  const siteData = useAppSelector((state) => state.sitesData);

  if (siteData) {
    sitesMap = { ...siteData.sites };
    if (!Object.hasOwn(sitesMap, formData.site_id)) {
      sitesMap[formData.site_id] = { id: formData.site_id, name_english: formData.site_name }
    }
    sitesList = Object.values(sitesMap);
    sitesList = sitesList.sort((a, b) => {
      return b.id - a.id;
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
              return option.id === value.id;
            }}
            onChange={(event, newValue) => {
              if (newValue !== null) {
                setFormData((prevState) => {
                  return { ...prevState, ["site_id"]: newValue.id };
                });
              }
            }}
            onInputChange={(event) => {
              const { value } = event.target;
              setSitePage(0);
              setSiteNameInput(value);
              handleChange(event);
            }}
            setPage={setSitePage}
            fullWidth
            size="medium"
            loading={sitesLoading}
            value={(siteNameInput === '' && Object.hasOwn(sitesMap, formData.site_id)) ? sitesMap[formData.site_id] : null}
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
            variant="outlined"
            onClick={() => handleCloseModal()}
            color="error"
          >
            Cancel
          </Button>
          <Button variant="contained" type="submit" color="success">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditPlot;
