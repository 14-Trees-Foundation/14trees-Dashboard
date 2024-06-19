import React, { useState } from 'react';
import { Autocomplete, Box, Button, Grid, Modal, TextField, Typography } from '@mui/material';
import TagSelector from '../../../components/TagSelector';

const AddPlot = ({ open, handleClose, createPlot, tags }) => {

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
        plot_id: '',
        category: '',
        district: '',
        gat: '',
        land_type: '',
        status: '',
        taluka: '',
        village: '',
        zone: '',
        boundaries: {
            type: '',
            coordinates: []
        },
        center: {
            type: '',
            coordinates: []
        },
        __v: 0,
        tags: []
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => {
            if (name.includes('.')) {
                const [parent, child] = name.split('.');
                return { ...prevState, [parent]: { ...prevState[parent], [child]: value } };
            } else {
                return { ...prevState, [name]: value };
            }
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        createPlot(formData);
        setFormData({
            name: '',
            plot_id: '',
            category: '',
            district: '',
            gat: '',
            land_type: '',
            status: '',
            taluka: '',
            village: '',
            zone: '',
            boundaries: {
                type: '',
                coordinates: ''
            },
            center: {
                type: '',
                coordinates: ''
            },
            __v: 0,
            tags: []
        });
        handleClose();
    };

    const categoriesList = [
        {id: 1, label: "Public"},
        {id: 2, label: "Foundation"},
    ]

    const categoriesMap = {
        1: "Public",
        2: "Foundation",
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant="h6" align="center" sx={{ marginBottom: '8px' }}>Add Plot</Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container rowSpacing={2} columnSpacing={1} >
                            <Grid item xs={12}>
                                <TextField name="name" label="Name" value={formData.name} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="plot_id" label="Plot ID" value={formData.plot_id} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    fullWidth
                                    name="category"
                                    disablePortal
                                    options={categoriesList}
                                    value={formData.category ? { id: formData.category, label: categoriesMap[formData.category] } : null}
                                    renderInput={(params) => <TextField {...params} label="Category" />}
                                    onChange={(event, value) => { if (value !== null) setFormData(prevState => ({ ...prevState, 'category': value.id }))}}
                                    getOptionLabel={(option) => (option.label)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="gat" label="Gat" value={formData.gat} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TagSelector tagsList={tags} value={formData.tags} handleChange={(tags) => setFormData({ ...formData, 'tags': tags })}/>
                            </Grid>
                            {/* <Grid item xs={12}>
                                <TextField name="district" label="District" value={formData.district} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="land_type" label="Land Type" value={formData.land_type} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="status" label="Status" value={formData.status} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="taluka" label="Taluka" value={formData.taluka} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="village" label="Village" value={formData.village} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="zone" label="Zone" value={formData.zone} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="boundaries.type" label="Boundaries Type" value={formData.boundaries.type} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="boundaries.coordinates"
                                    label="Boundaries Coordinates"
                                    value={formData.boundaries.coordinates}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="center.type" label="Center Type" value={formData.center.type} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="center.coordinates"
                                    label="Center Coordinates"
                                    value={formData.center.coordinates}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid> */}
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

export default AddPlot