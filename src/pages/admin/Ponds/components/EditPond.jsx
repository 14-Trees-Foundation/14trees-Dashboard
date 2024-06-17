import React, { useState } from 'react'
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

    const typesList = [
        "Storage",
        "Percolation",
    ]

    return (
        <Dialog open={openeditModal} onClose={() => setEditModal(false)}>
            <DialogTitle align="center">Edit Pond</DialogTitle>
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
                        options={typesList}
                        value={formData.type ? formData.type : ''}
                        renderInput={(params) => <TextField {...params} margin="dense" label="Type" />}
                        onChange={(event, value) => { if (value !== '') setFormData(prevState => ({ ...prevState, 'type': value }))}}
                    />
                    <TextField
                        name="length_ft"
                        label="Length (Ft)"
                        value={formData.length_ft}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        name="width_ft"
                        label="Width (Ft)"
                        value={formData.width_ft}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        name="depth_ft"
                        label="Depth (Ft)"
                        value={formData.depth_ft}
                        onChange={handleChange}
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