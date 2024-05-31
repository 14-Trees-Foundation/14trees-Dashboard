import React, { useState } from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";

function EditEvents({ row, openeditModal, setEditModal, editSubmit }) {

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
            <DialogTitle align="center">Edit Event</DialogTitle>
            <form onSubmit={handleEditSubmit}>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="id"
                        label="ID"
                        type="text"
                        fullWidth
                        value={formData.id}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="assigned_by"
                        label="Assigned By"
                        type="text"
                        fullWidth
                        value={formData.assigned_by}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="site_id"
                        label="Site ID"
                        type="text"
                        fullWidth
                        value={formData.site_id}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="type"
                        label="Type"
                        type="text"
                        fullWidth
                        value={formData.type}
                        onChange={handleChange}
                    />
                    <TextField
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
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        value={formData.description}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="event_location"
                        label="Event Location"
                        type="text"
                        fullWidth
                        value={formData.event_location}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="tags"
                        label="Tags"
                        type="text"
                        fullWidth
                        value={formData.tags}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="memories"
                        label="Memories"
                        type="text"
                        fullWidth
                        value={formData.memories}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="event_date"
                        label="Event Date"
                        type="text"
                        fullWidth
                        value={formData.event_date}
                        onChange={handleChange}
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

export default EditEvents