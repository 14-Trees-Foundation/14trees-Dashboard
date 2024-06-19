import React, { useState } from 'react';
import { Box, Button, Grid, Modal, TextField, Typography } from '@mui/material';

const AddSite = ({ open, handleClose, createSite }) => {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height: 450,
        overflow: 'auto',
        scrollbarWidth: 'thin',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        borderRadius: '10px',
        p: 4,
    };

    const [formData, setFormData] = useState({
        name: '',
        tree_id: '',
        desc: '',
        scientific_name: '',
        family: '',
        habit: '',
        name_english: '',
        remarkable_char: '',
        med_use: '',
        other_use: '',
        food: '',
        eco_value: '',
        parts_used: '',
    });

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        createSite(formData);
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant="h6" align="center" sx={{ marginBottom: '8px' }}>Add Tree Type</Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container rowSpacing={2} columnSpacing={1} >
                            <Grid item xs={12}>
                                <TextField name="name" label="Name" value={formData.name} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="tree_id" label="Tree ID" value={formData.phone} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="desc" label="Description" value={formData.desc} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="scientific_name" label="Scientific Name" value={formData.scientific_name} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="family" label="Family" value={formData.family} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="habit" label="Habit" value={formData.habit} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="name_english" label="Name (English)" value={formData.name_english} onChange={handleChange} fullWidth />
                            </Grid>

                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', }}>
                                <Button variant='outlined' type="submit">Submit</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>
        </div>
    )
}

export default AddSite