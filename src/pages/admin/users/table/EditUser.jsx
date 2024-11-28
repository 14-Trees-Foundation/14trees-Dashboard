import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

function EditUser({ row, openeditModal, onClose, editSubmit }) {
  const [formData, setFormData] = useState(row);

  useEffect(() => {
    setFormData(row);
  }, [row]);

  const handleChange = (event) => {
        setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    editSubmit(formData);
  };

  return (
    <Dialog open={openeditModal}>
      <DialogTitle align="center">Edit User</DialogTitle>
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
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="birth_date"
            label="Date of Birth"
            type="date"
            value={formData.birth_date ? formData.birth_date.substring(0, 10): ''}
            InputLabelProps={{ shrink: true }}
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
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "15px",
          }}>
          <Button
            variant="outlined"
            onClick={onClose}
            color="error">
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

export default EditUser;
