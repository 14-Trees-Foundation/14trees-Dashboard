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

function EditTree({ row, openeditModal, setEditModal, editSubmit }) {

    const [formData, setFormData] = useState(row);
    console.log(formData);
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => {
            if (name === 'tree_id.name') {
                return { ...prevState, tree_id: { ...prevState.tree_id, name: value } };
            } else if (name.includes('_')) {
                const [parent, child] = name.split('_');
                return { ...prevState, [parent]: { ...prevState[parent], [child]: value } };
            }
            return { ...prevState, [name]: value };
        });
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        editSubmit(formData);
        setEditModal(false);
    };

    return (
        <Dialog open={openeditModal} onClose={() => setEditModal(false)}>
            <DialogTitle align="center">Edit Tree</DialogTitle>
            <form onSubmit={handleEditSubmit}>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="sapling_id"
                        label="Sapling ID"
                        type="text"
                        fullWidth
                        value={formData.sapling_id}
                        onChange={handleChange}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        name="tree_id._id"
                        label="Tree ID"
                        type="text"
                        fullWidth
                        value={formData.tree_id}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="plot_id"
                        label="Plot ID"
                        type="text"
                        fullWidth
                        value={formData.plot_id}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="date_added"
                        label="Date Added"
                        type="text"
                        fullWidth
                        value={formData.date_added}
                        onChange={handleChange}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        name="link"
                        label="Link"
                        type="text"
                        fullWidth
                        value={formData.link}
                        onChange={handleChange}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        name="mapped_to"
                        label="Mapped To"
                        type="text"
                        fullWidth
                        value={formData.mapped_to}
                        onChange={handleChange}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        name="event_type"
                        label="Event Type"
                        type="text"
                        fullWidth
                        value={formData.event_type}
                        onChange={handleChange}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        name="date_assigned"
                        label="Date Assigned"
                        type="text"
                        fullWidth
                        value={formData.date_assigned}
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

export default EditTree