import React, { useState } from 'react';
import { Box, Button, Grid, Modal, TextField, Typography } from '@mui/material';

const AddPond = ({ open, handleClose, createPondData }) => {

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
        boundaries: {
            type: '',
            coordinates: ''
        },
        _id: '',
        name: '',
        tags: [],
        type: '',
        date_added: '',
        images: [],
        lengthFt: '',
        widthFt: '',
        depthFt: '',
        __v: 0
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => {
            if(name.includes('.')) {
                const [parent, child] = name.split('.');
                return { ...prevState, [parent]: { ...prevState[parent], [child]: value }};
            } else {
                return { ...prevState, [name]: value };
            }
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        createPondData(formData);
        setFormData({
            boundaries: {
                type: '',
                coordinates: ''
            },
            _id: '',
            name: '',
            tags: [],
            type: '',
            date_added: '',
            images: [],
            lengthFt: '',
            widthFt: '',
            depthFt: '',
            __v: 0
        });
        handleClose();
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

                    <form onSubmit={handleSubmit}>
                        <Grid container rowSpacing={2} columnSpacing={1} >
                            <Grid item xs={12}>
                                <TextField name="name" label="Name" value={formData.name} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="type" label="Type" value={formData.type} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="lengthFt" label="Length Ft" value={formData.lengthFt} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="widthFt" label="Width Ft" value={formData.widthFt} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="depthFt" label="Depth Ft" value={formData.depthFt} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="boundaries.type" label="Boundaries Type" value={formData.boundaries.type} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="boundaries.coordinates" label="Boundaries Coordinates" value={formData.boundaries.coordinates} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', }}>
                                <Button variant='contained' type="submit">Submit</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>
        </div>
    )
}

export default AddPond