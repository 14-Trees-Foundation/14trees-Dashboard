import React, { useState } from 'react'
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

function EditPond({ row, openeditModal, setEditModal, editSubmit }) {

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
            <DialogTitle align="center">Edit Plot</DialogTitle>
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
                    name="plot_id"
                    label="Plot ID"
                    value={formData.plot_id}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    name="category"
                    label="Category"
                    value={formData.category}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    name="district"
                    label="District"
                    value={formData.district}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    name="gat"
                    label="Gat"
                    value={formData.gat}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    name="land_type"
                    label="Land Type"
                    value={formData.land_type}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    name="status"
                    label="Status"
                    value={formData.status}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    name="taluka"
                    label="Taluka"
                    value={formData.taluka}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    name="village"
                    label="Village"
                    value={formData.village}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    name="zone"
                    label="Zone"
                    value={formData.zone}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    name="__v"
                    label="__V"
                    value={formData.__v}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    name="boundaries.type"
                    label="Boundaries Type"
                    value={formData.boundaries.type}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    name="boundaries.coordinates"
                    label="Boundaries Coordinates"
                    value={formData.boundaries.coordinates}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    name="center.type"
                    label="Center Type"
                    value={formData.center.type}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    name="center.coordinates"
                    label="Center Coordinates"
                    value={formData.center.coordinates}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                    <Button variant='contained' onClick={() => setEditModal(false)} color="primary">
                        Cancel
                    </Button>
                    <Button variant='contained' type="submit" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default EditPond