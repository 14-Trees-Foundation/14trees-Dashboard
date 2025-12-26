import React, { useEffect, useState } from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    TextField,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

    const handleEmailConfigChange = (field: string, value: any) => {
        setFormData({
            ...formData,
            email_config: {
                ...formData.email_config,
                sponsor_email: {
                    ...formData.email_config?.sponsor_email,
                    [field]: value,
                },
            },
        });
    };

    const handleEmailConfigCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enabled = event.target.checked;
        if (!enabled) {
            setFormData({
                ...formData,
                email_config: null,
            });
        } else {
            setFormData({
                ...formData,
                email_config: {
                    sponsor_email: {
                        enabled: true,
                        from_name: '',
                        from_email: '',
                        subject_template_single: '',
                        subject_template_multi: '',
                        reply_to: '',
                        cc_emails: [],
                        template_name_single: '',
                        template_name_multi: '',
                    },
                },
            });
        }
    };

    const handleCCEmailsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const emails = event.target.value.split(',').map(email => email.trim()).filter(email => email);
        handleEmailConfigChange('cc_emails', emails);
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

                    <Box sx={{ mt: 2 }}>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>Email Configuration (Optional)</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={formData.email_config?.sponsor_email?.enabled || false}
                                                onChange={handleEmailConfigCheckbox}
                                            />
                                        }
                                        label="Enable campaign-specific sponsor emails"
                                    />

                                    {formData.email_config?.sponsor_email?.enabled && (
                                        <>
                                            <TextField
                                                label="From Name"
                                                value={formData.email_config?.sponsor_email?.from_name || ''}
                                                onChange={(e) => handleEmailConfigChange('from_name', e.target.value)}
                                                fullWidth
                                                size="small"
                                                helperText="e.g., Sia Domkundwar of Glowback"
                                            />

                                            <TextField
                                                label="From Email (optional)"
                                                value={formData.email_config?.sponsor_email?.from_email || ''}
                                                onChange={(e) => handleEmailConfigChange('from_email', e.target.value)}
                                                fullWidth
                                                size="small"
                                                helperText="e.g., noreply@glowback.com"
                                            />

                                            <TextField
                                                label="Reply To (optional)"
                                                value={formData.email_config?.sponsor_email?.reply_to || ''}
                                                onChange={(e) => handleEmailConfigChange('reply_to', e.target.value)}
                                                fullWidth
                                                size="small"
                                                helperText="e.g., hello@glowback.com"
                                            />

                                            <TextField
                                                label="Subject Template (Single Tree)"
                                                value={formData.email_config?.sponsor_email?.subject_template_single || ''}
                                                onChange={(e) => handleEmailConfigChange('subject_template_single', e.target.value)}
                                                fullWidth
                                                size="small"
                                                helperText="e.g., Your Glowback is live 🌱"
                                            />

                                            <TextField
                                                label="Subject Template (Multiple Trees)"
                                                value={formData.email_config?.sponsor_email?.subject_template_multi || ''}
                                                onChange={(e) => handleEmailConfigChange('subject_template_multi', e.target.value)}
                                                fullWidth
                                                size="small"
                                                helperText="e.g., Your Glowback trees are live 🌱"
                                            />

                                            <TextField
                                                label="Template Name (Single Tree)"
                                                value={formData.email_config?.sponsor_email?.template_name_single || ''}
                                                onChange={(e) => handleEmailConfigChange('template_name_single', e.target.value)}
                                                fullWidth
                                                size="small"
                                                helperText="e.g., campaigns/glowback-sponsor-single-tree.html"
                                            />

                                            <TextField
                                                label="Template Name (Multiple Trees)"
                                                value={formData.email_config?.sponsor_email?.template_name_multi || ''}
                                                onChange={(e) => handleEmailConfigChange('template_name_multi', e.target.value)}
                                                fullWidth
                                                size="small"
                                                helperText="e.g., campaigns/glowback-sponsor-multi-trees.html"
                                            />

                                            <TextField
                                                label="CC Emails (comma-separated)"
                                                value={formData.email_config?.sponsor_email?.cc_emails?.join(', ') || ''}
                                                onChange={handleCCEmailsChange}
                                                fullWidth
                                                size="small"
                                                helperText="e.g., sia@glowback.com, team@glowback.com"
                                            />
                                        </>
                                    )}
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
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