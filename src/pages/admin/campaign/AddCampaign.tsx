import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Box, Button, Grid, Modal, TextField, Typography } from '@mui/material';

interface CampaignFormData {
    c_key: string;
    name: string;
    description: string;
}

interface AddCampaignDialogProps {
    open: boolean;
    handleClose: () => void;
    handleSave: (formData: CampaignFormData) => void;
}

const AddCampaignDialog: React.FC<AddCampaignDialogProps> = ({ open, handleClose, handleSave }) => {
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        borderRadius: '10px',
        p: 4,
    };

    const [formData, setFormData] = useState<CampaignFormData>({
        c_key: '',
        name: '',
        description: '',
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        handleSave(formData);
        handleClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="add-campaign-modal"
            aria-describedby="add-campaign-form"
        >
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Add New Campaign
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="c_key"
                                label="Campaign Key"
                                value={formData.c_key}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="name"
                                label="Name"
                                value={formData.name}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="description"
                                label="Description"
                                value={formData.description}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={4}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={handleClose}
                                color="error"
                                sx={{ mr: 2 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};

export default AddCampaignDialog;