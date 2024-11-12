import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Chip, Typography, Button, FormControl, FormControlLabel, Checkbox, OutlinedInput, Autocomplete, TextField, FormGroup, Box } from '@mui/material';
import { EmailTemplate } from '../../../../types/email_template';
import ApiClient from '../../../../api/apiClient/apiClient';
import { toast } from 'react-toastify';

interface EmailConfirmationModalProps {
    sponsorMail?: string;
    open: boolean;
    onClose: () => void;
    onSubmit: (emailSponsor: boolean, emailReceiver: boolean, testMails: string[], ccMails: string[], templateType: string, attachCard: boolean) => void;
}

const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({ sponsorMail, open, onClose, onSubmit }) => {
    const [toEmails, setToEmails] = useState<string[]>([]);
    const [ccEmails, setCcEmails] = useState<string[]>(sponsorMail ? [sponsorMail] : []);
    const [emailInput, setEmailInput] = useState('');
    const [ccInput, setCcInput] = useState('');
    const [attachCards, setAttachCards] = useState(false);
    const [emailSponsor, setEmailSponsor] = useState(false);
    const [emailReceiver, setEmailReceiver] = useState(false);
    const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

    useEffect(() => {
        const getEmailTemplates = async () => {
            const apiClient = new ApiClient();
            const templates = await apiClient.getEmailTemplates();
            const uniqueTemplates: EmailTemplate[] 
                = templates
                    .filter((template, index, self) => self.findIndex(item => item.event_type === template.event_type) === index);

            setEmailTemplates(uniqueTemplates);
            setSelectedTemplate(uniqueTemplates.find(template => template.event_type === 'default') ?? null);
        }

        getEmailTemplates();
    }, [])

    useEffect(() => {
        if (sponsorMail) setCcEmails([sponsorMail]);
    }, [sponsorMail]);

    const handleAddEmail = (input: string, setEmails: React.Dispatch<React.SetStateAction<string[]>>, setInput: React.Dispatch<React.SetStateAction<string>>) => {
        if (input && /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(input)) {
            setEmails((prevEmails) => [...prevEmails, input]);
            setInput('');
        }
    };

    const handleDeleteEmail = (email: string, setEmails: React.Dispatch<React.SetStateAction<string[]>>) => {
        setEmails((prevEmails) => prevEmails.filter((item) => item !== email));
    };

    const handleSendMails = () => {
        if (!selectedTemplate) {
            toast.error("Please select email template to send!");
            return;
        }

        onSubmit(emailSponsor, emailReceiver, toEmails, ccEmails, selectedTemplate.event_type, attachCards);
    };

    return (
        <Dialog open={open} fullWidth maxWidth="lg">
            <DialogTitle>Send Emails</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body1" gutterBottom>
                    Add CC email addresses.
                </Typography>

                {/* CC Email Addresses */}
                <FormControl fullWidth>
                    <OutlinedInput
                        placeholder="Enter CC email and press Enter"
                        value={ccInput}
                        onChange={(e) => setCcInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddEmail(ccInput, setCcEmails, setCcInput);
                            }
                        }}
                        startAdornment={
                            ccEmails.map((email, index) => (
                                <Chip
                                    key={index}
                                    label={email}
                                    onDelete={() => handleDeleteEmail(email, setCcEmails)}
                                    color="secondary"
                                    sx={{ marginRight: 0.5 }}
                                />
                            ))
                        }
                    />
                </FormControl>

                <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
                    In case, you want to check emails first, enter your email address below in order to receive test emails.
                </Typography>
                {/* Recipient Email Addresses */}
                <FormControl fullWidth>
                    <OutlinedInput
                        placeholder="Enter test email and press Enter"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddEmail(emailInput, setToEmails, setEmailInput);
                            }
                        }}
                        startAdornment={
                            toEmails.map((email, index) => (
                                <Chip
                                    key={index}
                                    label={email}
                                    onDelete={() => handleDeleteEmail(email, setToEmails)}
                                    color="primary"
                                    sx={{ marginRight: 0.5 }}
                                />
                            ))
                        }
                    />
                </FormControl>

                <Box sx={{ mt: 2 }}>
                    <Typography >To whom do you what to send emails?</Typography>
                    <FormControl component="fieldset">
                        <FormGroup aria-label="position" row>
                            <FormControlLabel
                                value="receiver"
                                control={<Checkbox checked={emailReceiver} onChange={(e) => { setEmailReceiver(e.target.checked) }} />}
                                label="Receivers"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="sponsor"
                                control={<Checkbox checked={emailSponsor} onChange={(e) => { setEmailSponsor(e.target.checked) }} />}
                                label="Sponsor"
                                labelPlacement="end"
                            />
                        </FormGroup>
                    </FormControl>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography >Do you want to send gift card image as an attachment in emails?</Typography>
                    <FormControl component="fieldset">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={attachCards}
                                    onChange={(e) => setAttachCards(e.target.checked)}
                                    name="manual"
                                />
                            }
                            label="Yes"
                        />
                    </FormControl>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography >You can select different type of email template below.</Typography>
                    <Autocomplete
                        value={selectedTemplate}
                        options={emailTemplates}
                        getOptionLabel={option => option.event_name}
                        onChange={(e, value) => { setSelectedTemplate(value) }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                margin='dense'
                                label='Email Template'
                                required
                            />
                        )}
                    />
                </Box>

            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="error">
                    Cancel
                </Button>
                <Button onClick={handleSendMails} color="success" variant="contained">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EmailConfirmationModal;
