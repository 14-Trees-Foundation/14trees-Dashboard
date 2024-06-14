import React, { useState } from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";

function EditTreeType({row, openeditModal, handleCloseEditModal, editSubmit}) {

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
        handleCloseEditModal(false);
    };

    return (
        <Dialog open={openeditModal} onClose={() => handleCloseEditModal(false)}>
            <DialogTitle align="center">Edit Tree Type</DialogTitle>
            <form onSubmit={handleEditSubmit}>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="name_english"
                        label="Name (English)"
                        type="text"
                        fullWidth
                        value={formData.name_english}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="scientific_name"
                        label="Scientific Name"
                        type="text"
                        fullWidth
                        value={formData.scientific_name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="habit"
                        label="Habit"
                        type="text"
                        fullWidth
                        value={formData.habit}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="plant_type_id"
                        label="Plant Type ID"
                        type="text"
                        fullWidth
                        value={formData.plant_type_id}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center', marginBottom:'15px'}}>
                    <Button variant='contained' onClick={() => handleCloseEditModal(false)} color="primary">
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

export default EditTreeType