import React, { useState } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { organizationTypes } from "./organizationType";

function EditUser({ row, openeditModal, handleClose, editSubmit }) {
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
    handleClose();
  };

  return (
    <Dialog open={openeditModal} onClose={handleClose}>
      <DialogTitle align="center">Edit Organization</DialogTitle>
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
          <Autocomplete
            fullWidth
            name="type"
            disablePortal
            options={organizationTypes}
            value={formData.type ? organizationTypes.find((option) => option.id === formData.type): undefined}
            onChange={(event, value) => { if (value !== null) setFormData(prevState => ({ ...prevState, 'type': value.id }))}}
            getOptionLabel={(option) => (option.label)}
            renderInput={(params) => <TextField {...params} margin="dense" label="Type" />}
          />
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "15px",
          }}>
          <Button
            variant="contained"
            onClick={handleClose}
            color="primary">
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

export default EditUser;
