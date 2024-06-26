import React, { useState } from 'react'
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

function EditPlot({ row, openeditModal, handleCloseModal, editSubmit, tags }) {

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

    const categoriesList = [ "Public", "Foundation" ];

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
                <Autocomplete
                    fullWidth
                    name="category"
                    disablePortal
                    options={categoriesList}
                    value={formData.category}
                    renderInput={(params) => <TextField {...params} margin="dense" label="Category" />}
                    onChange={(event, value) => { if (categoriesList.includes(value)) setFormData(prevState => ({ ...prevState, 'category': value }))}}
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
                    handleChange={(tags) => setFormData({ ...formData, 'tags': tags })}
                    margin='dense'
                />
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                    <Button variant='contained' onClick={() => handleCloseModal()} color="primary">
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

export default EditPlot