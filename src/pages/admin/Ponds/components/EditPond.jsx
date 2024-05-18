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
            <DialogTitle align="center">Edit User</DialogTitle>
            <form onSubmit={handleEditSubmit}>
                <DialogContent>
                    <TextField
                        name="_id"
                        label="ID"
                        value={formData._id}
                        onChange={handleChange}
                        disabled
                        fullWidth
                        margin="dense"
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
                        name="type"
                        label="Type"
                        value={formData.type}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        name="date_added"
                        label="Date Added"
                        value={formData.date_added}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                        disabled
                    />
                    <TextField
                        name="lengthFt"
                        label="Length (Ft)"
                        value={formData.lengthFt}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        name="widthFt"
                        label="Width (Ft)"
                        value={formData.widthFt}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        name="depthFt"
                        label="Depth (Ft)"
                        value={formData.depthFt}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        name="__v"
                        label="Version"
                        value={formData.__v}
                        onChange={handleChange}
                        disabled
                        fullWidth
                        margin="dense"
                    />
                    {/* For boundaries, you might need a more complex UI component */}
                {/* For tags and images, you might need a list input or a file input */}
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