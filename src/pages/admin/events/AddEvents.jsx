import React, { useState } from 'react';
import { Box, Button, Grid, Modal, TextField, Typography } from '@mui/material';
import { Height } from '@mui/icons-material';

const AddEvents = ({ open, handleClose, createEvents }) => {

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
        assigned_by: '',
        site_id: '',
        type: '',
        name: '',
        description: '',
        event_location: '',
        tags: '',
        memories: '',
        event_date: '',
    });

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // createTreeData(formData);
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
                    <Typography variant="h6" align="center" sx={{ marginBottom: '8px' }}>Add Event</Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container rowSpacing={2} columnSpacing={1} >
                            <Grid item xs={12}>
                                <TextField
                                    name="assigned_by"
                                    label="Assigned By"
                                    value={formData.assigned_by}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="site_id"
                                    label="Site ID"
                                    value={formData.site_id}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="type"
                                    label="Type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="name"
                                    label="Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="description"
                                    label="Description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="event_location"
                                    label="Event Location"
                                    value={formData.event_location}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="tags"
                                    label="Tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="memories"
                                    label="Memories"
                                    value={formData.memories}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="event_date"
                                    label="Event Date"
                                    value={formData.event_date}
                                    onChange={handleChange}
                                    fullWidth
                                />
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

export default AddEvents