import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
} from "@mui/material";

interface EditCampaignProps {
    row: any;
    open: boolean;
    handleClose: () => void;
    onSubmit: (data: any) => Promise<void>;
}

const EditCampaign = ({ row, open, handleClose, onSubmit }: EditCampaignProps) => {
    const [formData, setFormData] = useState(row);
    const [loading, setLoading] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            handleClose();
        } catch (error) {
            console.error("Error updating campaign:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("EditCampaign row prop:", row);
        setFormData(row);
    }, [row]);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
            <DialogTitle> <Typography align="center" variant="h6">
                Edit Campaign
            </Typography></DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        name="c_key"
                        label="Campaign Key"
                        value={formData.c_key || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                    />

                    <TextField
                        name="name"
                        label="Name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                    />

                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        name="description"
                        label="Description"
                        value={formData.description || ''}
                        onChange={handleChange}
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions sx={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "16px 24px",
                }}>
                    <Button
                        variant="outlined"
                        onClick={handleClose}
                        color="error"
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        type="submit"
                        color="success"
                        disabled={loading}
                        sx={{ marginLeft: '10px' }}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditCampaign;