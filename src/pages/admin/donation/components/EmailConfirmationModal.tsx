import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Chip, Typography, Button, FormControl, FormControlLabel, Checkbox, OutlinedInput, Autocomplete, TextField, FormGroup, Box } from '@mui/material';
import { EmailTemplate } from '../../../../types/email_template';
import ApiClient from '../../../../api/apiClient/apiClient';
import { toast } from 'react-toastify';

interface EmailConfirmationModalProps {
    donorMail?: string;
    open: boolean;
    onClose: () => void;
    onSubmit: (emailDonor: boolean, emailReceiver: boolean, emailAssignee: boolean, testMails: string[], ccMails: string[], templateType: string) => void;
}

const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({ donorMail, open, onClose, onSubmit }) => {
    const [toEmails, setToEmails] = useState<string[]>([]);
    const [ccEmails, setCcEmails] = useState<string[]>([]);
    const [emailInput, setEmailInput] = useState('');
    const [ccInput, setCcInput] = useState('');
    const [emailDonor, setEmailDonor] = useState(true);
    const [emailReceiver, setEmailReceiver] = useState(false);
    const [emailAssignee, setEmailAssignee] = useState(false);
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
        if (donorMail) setCcEmails([donorMail]);
    }, [donorMail]);

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

        onSubmit(emailDonor, emailReceiver, emailAssignee, toEmails, ccEmails, selectedTemplate.event_type);
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
                    <Typography >Who would you like to send the emails to?</Typography>
                    <FormControl component="fieldset">
                        <FormGroup aria-label="position" row>
                            <FormControlLabel
                                value="receiver"
                                control={<Checkbox checked={emailReceiver} onChange={(e) => { setEmailReceiver(e.target.checked) }} />}
                                label="Receivers"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="donor"
                                control={<Checkbox checked={emailDonor} onChange={(e) => { setEmailDonor(e.target.checked) }} />}
                                label="Donor"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="assignee"
                                control={<Checkbox checked={emailAssignee} onChange={(e) => { setEmailAssignee(e.target.checked) }} />}
                                label="Assignees"
                                labelPlacement="end"
                            />
                        </FormGroup>
                    </FormControl>
                </Box>

                {/* <Box sx={{ mt: 2 }}>
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
                    </Box> */ }

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
