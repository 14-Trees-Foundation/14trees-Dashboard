import React, { useState } from "react";
import {
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

function EditUser({ row, openeditModal, setEditModal, editSubmit }) {
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
    setEditModal(false);
  };

  return (
    <Dialog open={openeditModal} onClose={() => setEditModal(false)}>
      <DialogTitle align="center">Edit User</DialogTitle>
      <form onSubmit={handleEditSubmit}>
        <DialogContent>
          <TextField
            name="_id"
            label="ID"
            value={formData._id}
            onChange={handleChange}
            fullWidth
            margin="dense"
            disabled
          />
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="dob"
            label="Date of Birth"
            value={formData.dob}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="phone"
            label="Phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="userid"
            label="User ID"
            value={formData.userid}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="key"
            label="Key"
            value={formData.key}
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
            onClick={() => setEditModal(false)}
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
