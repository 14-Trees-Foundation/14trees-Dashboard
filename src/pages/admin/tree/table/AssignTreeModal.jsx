import { useState } from 'react';
import { Box, Button, Grid, Modal, TextField, Typography } from '@mui/material';

const AssignTreeModal = ({ open, handleClose, onSubmit }) => {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        borderRadius:'10px',
        p: 4,
    };

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        org: '',
        donor: '',
        plantation_type: '',
        gifted_by: '',
        planted_by: '',
        desc: '',
    });

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData);
        onSubmit(formData);
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
                                <TextField name="name" label="Name" value={formData.name} onChange={handleChange} fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="phone" label="Phone" value={formData.phone} onChange={handleChange} fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="email" label="Email" value={formData.email} onChange={handleChange} fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="org" label="Org" value={formData.org} onChange={handleChange} fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="donor" label="Donor" value={formData.donor} onChange={handleChange} fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="plantation_type" label="Planted Type" value={formData.plantation_type} onChange={handleChange} fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="gifted_by" label="Gifted By" value={formData.gifted_by} onChange={handleChange} fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="planted_by" label="Planted By" value={formData.planted_by} onChange={handleChange} fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="desc" label="Desc" value={formData.desc} onChange={handleChange} fullWidth/>
                            </Grid>
                            <Grid item xs={12} sx={{display:'flex', justifyContent:'center', }}>
                                <Button type="submit">Submit</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>
        </div>
    )
}

export default AssignTreeModal;