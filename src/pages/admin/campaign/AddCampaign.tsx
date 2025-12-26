import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Modal,
    TextField,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CampaignEmailConfig } from '../../../types/campaign';

interface CampaignFormData {
    c_key: string;
    name: string;
    description: string;
    email_config?: CampaignEmailConfig | null;
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
        width: 600,
        maxHeight: '90vh',
        overflowY: 'auto',
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
        email_config: null,
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
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

    const handleEmailConfigCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
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

    const handleCCEmailsChange = (event: ChangeEvent<HTMLInputElement>) => {
        const emails = event.target.value.split(',').map(email => email.trim()).filter(email => email);
        handleEmailConfigChange('cc_emails', emails);
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
                        <Grid item xs={12}>
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