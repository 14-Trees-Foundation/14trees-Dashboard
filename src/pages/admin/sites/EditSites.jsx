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

function EditSites({ row, openeditModal, closeEditModal, editSubmit }) {

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
        closeEditModal();
    };

    return (
        <Dialog open={openeditModal} onClose={() => closeEditModal()}>
            <DialogTitle align="center">Edit Site</DialogTitle>
            <form onSubmit={handleEditSubmit}>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name_marathi"
                        label="Name (Marathi)"
                        type="text"
                        fullWidth
                        value={formData.name_marathi}
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
                        name="owner"
                        label="Owner"
                        type="text"
                        fullWidth
                        value={formData.owner}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="land_type"
                        label="Land Type"
                        type="text"
                        fullWidth
                        value={formData.land_type}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="land_strata"
                        label="Land Strata"
                        type="text"
                        fullWidth
                        value={formData.land_strata}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="district"
                        label="District"
                        type="text"
                        fullWidth
                        value={formData.district}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="taluka"
                        label="Taluka"
                        type="text"
                        fullWidth
                        value={formData.taluka}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="village"
                        label="Village"
                        type="text"
                        fullWidth
                        value={formData.village}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="area_acres"
                        label="Area (Acres)"
                        type="text"
                        fullWidth
                        value={formData.area_acres}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="length_km"
                        label="Length (Km)"
                        type="text"
                        fullWidth
                        value={formData.length_km}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="tree_count"
                        label="Tree Count"
                        type="text"
                        fullWidth
                        value={formData.tree_count}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="unique_id"
                        label="Unique ID"
                        type="text"
                        fullWidth
                        value={formData.unique_id}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="photo_album"
                        label="Photo Album"
                        type="text"
                        fullWidth
                        value={formData.photo_album}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="consent_letter"
                        label="Consent Letter"
                        type="text"
                        fullWidth
                        value={formData.consent_letter}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="grove_type"
                        label="Grove Type"
                        type="text"
                        fullWidth
                        value={formData.grove_type}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="map_to"
                        label="Map To"
                        type="text"
                        fullWidth
                        value={formData.map_to}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="notion_db_pictures"
                        label="Notion DB Pictures"
                        type="text"
                        fullWidth
                        value={formData.notion_db_pictures}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="split_village_name_1"
                        label="Split Village Name 1"
                        type="text"
                        fullWidth
                        value={formData.split_village_name_1}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="split_village_name_2"
                        label="Split Village Name 2"
                        type="text"
                        fullWidth
                        value={formData.split_village_name_2}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="create_id"
                        label="Create ID"
                        type="text"
                        fullWidth
                        value={formData.create_id}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="site_key"
                        label="Site Key"
                        type="text"
                        fullWidth
                        value={formData.site_key}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="site_key_2"
                        label="Site Key 2"
                        type="text"
                        fullWidth
                        value={formData.site_key_2}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="temp_backup_copy_of_old_site_name_english_marathi"
                        label="Temp Backup Copy of Old Site Name"
                        type="text"
                        fullWidth
                        value={formData.temp_backup_copy_of_old_site_name_english_marathi}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="temp_copy_of_old_site_key"
                        label="Temp Copy of Old Site Key"
                        type="text"
                        fullWidth
                        value={formData.temp_copy_of_old_site_key}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="temp_old_site_name_in_english"
                        label="Temp Old Site Name (English)"
                        type="text"
                        fullWidth
                        value={formData.temp_old_site_name_in_english}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="temp_old_site_name_in_marathi"
                        label="Temp Old Site Name (Marathi)"
                        type="text"
                        fullWidth
                        value={formData.temp_old_site_name_in_marathi}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="created_at"
                        label="Created At"
                        type="text"
                        fullWidth
                        value={formData.created_at}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="updated_at"
                        label="Updated At"
                        type="text"
                        fullWidth
                        value={formData.updated_at}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                    <Button variant='contained' onClick={() => closeEditModal()} color="primary">
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

export default EditSites