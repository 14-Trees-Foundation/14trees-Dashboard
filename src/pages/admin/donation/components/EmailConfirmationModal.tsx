import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Chip, Typography, Button, FormControl, FormControlLabel, Checkbox, OutlinedInput, FormGroup, Box, InputAdornment } from '@mui/material';
import { EmailOutlined } from '@mui/icons-material';
import ApiClient from '../../../../api/apiClient/apiClient';
import { toast } from 'react-toastify';

interface EmailConfirmationModalProps {
    donorMail?: string;
    open: boolean;
    onClose: () => void;
    onSubmit: (
        email_sponsor: boolean, 
        email_recipient: boolean, 
        email_assignee: boolean, 
        test_mails: string[], 
        sponsor_cc_mails: string[], 
        recipient_cc_mails: string[], 
        assignee_cc_mails: string[], 
        event_type: string
    ) => void;
    donation_id: string;
}

const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({ donorMail, open, onClose, onSubmit, donation_id }) => {
    const [test_mails, setTestMails] = useState<string[]>([]);
    const [sponsor_cc_mails, setSponsorCcMails] = useState<string[]>([]);
    const [recipient_cc_mails, setRecipientCcMails] = useState<string[]>([]);
    const [assignee_cc_mails, setAssigneeCcMails] = useState<string[]>([]);
    const [test_email_input, setTestEmailInput] = useState('');
    const [sponsor_cc_input, setSponsor_cc_input] = useState('');
    const [recipient_cc_input, setRecipient_cc_input] = useState('');
    const [assignee_cc_input, setAssignee_cc_input] = useState('');
    const [email_sponsor, setEmailSponsor] = useState(false);
    const [email_recipient, setEmailRecipient] = useState(true);
    const [email_assignee, setEmailAssignee] = useState(false);
    const [isTestEmailValid, setIsTestEmailValid] = useState(false);
    const [isTestLoading, setIsTestLoading] = useState(false);
    const [isConfirmLoading, setIsConfirmLoading] = useState(false);

    useEffect(() => {
        if (open && donorMail) {
            setSponsorCcMails([donorMail]);
            setRecipientCcMails([donorMail]);
        }
    }, [open, donorMail]);

    const handleAddEmail = (input: string, setEmails: React.Dispatch<React.SetStateAction<string[]>>, setInput: React.Dispatch<React.SetStateAction<string>>) => {
        if (input && /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(input)) {
            setEmails((prevEmails) => [...prevEmails, input]);
            setInput('');
        }
    };

    const handleDeleteEmail = (email: string, setEmails: React.Dispatch<React.SetStateAction<string[]>>) => {
        setEmails((prevEmails) => prevEmails.filter((item) => item !== email));
    };

    const handleTestEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTestEmailInput(value);
        setIsTestEmailValid(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value));
    };

    const resetState = () => {
        setTestMails([]);
        setSponsorCcMails([]);
        setAssigneeCcMails([]);
        setTestEmailInput('');
        setSponsor_cc_input('');       
        setAssignee_cc_input('');
        setEmailSponsor(false);
        setEmailRecipient(true);
        setEmailAssignee(false);
        setIsTestEmailValid(false);
        setIsTestLoading(false);
        setIsConfirmLoading(false);
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    const addTestEmail = () => {
        if (isTestEmailValid && test_mails.length < 5) {
            handleAddEmail(test_email_input, setTestMails, setTestEmailInput);
        }
    };

    const handleTestEmail = async () => {
        if (test_mails.length > 0) {
            setIsTestLoading(true);
            try {
                const apiClient = new ApiClient();
                await apiClient.sendEmailForDonation(
                    parseInt(donation_id),
                    test_mails,
                    sponsor_cc_mails,
                    recipient_cc_mails,
                    assignee_cc_mails,
                    'default', // Event type
                    email_sponsor,
                    email_recipient,
                    email_assignee
                );
                toast.success('Test emails initiated!');
                resetState(); // Reset state after sending test email
            } catch (error) {
                toast.error('Failed to send test email.');
            } finally {
                setIsTestLoading(false);
            }
        }
    };

    const handleSendMails = async () => {
        setIsConfirmLoading(true);
        try {
            const apiClient = new ApiClient();
            await apiClient.sendEmailForDonation(
                parseInt(donation_id),
                [],
                sponsor_cc_mails,
                recipient_cc_mails,
                assignee_cc_mails,
                'default',
                email_sponsor,
                email_recipient,
                email_assignee
            );
            toast.success("Processor for sending email has started. You can check email status for individual in view summary after some time!");
            resetState();
            onClose(); // Close modal only on successful confirmation
        } catch (error) {
            toast.error('Failed to send emails. Please try again.');
        } finally {
            setIsConfirmLoading(false);
        }
    };

    return (
        <Dialog 
            open={open} 
            fullWidth 
            maxWidth="lg"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '& .MuiDialog-paper': {
                    maxHeight: '90vh',
                    overflow: 'auto'
                }
            }}
        >
            <DialogTitle>Send Emails</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ mt: 1 }}>
                    <Typography>Who would you like to send the emails to?</Typography>
                    <FormControl component="fieldset">
                        <FormGroup aria-label="position" row>
                            <FormControlLabel
                                value="recipient"
                                control={<Checkbox checked={email_recipient} onChange={(e) => { setEmailRecipient(e.target.checked) }} />}
                                label="Recipients"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="sponsor"
                                control={<Checkbox checked={email_sponsor} onChange={(e) => { setEmailSponsor(e.target.checked) }} />}
                                label="Sponsor"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="assignee"
                                control={<Checkbox checked={email_assignee} onChange={(e) => { setEmailAssignee(e.target.checked) }} />}
                                label="Assignees"
                                labelPlacement="end"
                            />
                        </FormGroup>
                    </FormControl>
                </Box>

                {email_recipient && (
                    <Box sx={{ mt: 2 }}>
                        <Typography>Add CC email addresses for recipients.</Typography>
                        <FormControl fullWidth>
                            <OutlinedInput
                                placeholder="Enter recipient CC email and press Enter"
                                value={recipient_cc_input}
                                onChange={(e) => setRecipient_cc_input(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddEmail(recipient_cc_input, setRecipientCcMails, setRecipient_cc_input);
                                    }
                                }}
                                startAdornment={
                                    recipient_cc_mails.map((email, index) => (
                                        <Chip
                                            key={index}
                                            label={email}
                                            onDelete={() => handleDeleteEmail(email, setRecipientCcMails)}
                                            color="secondary"
                                            sx={{ marginRight: 0.5 }}
                                        />
                                    ))
                                }
                            />
                        </FormControl>
                    </Box>
                )}

                {email_sponsor && (
                    <Box sx={{ mt: 2 }}>
                        <Typography>Add CC email addresses for sponsors.</Typography>
                        <FormControl fullWidth>
                            <OutlinedInput
                                placeholder="Enter sponsor CC email and press Enter"
                                value={sponsor_cc_input}
                                onChange={(e) => setSponsor_cc_input(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddEmail(sponsor_cc_input, setSponsorCcMails, setSponsor_cc_input);
                                    }
                                }}
                                startAdornment={
                                    sponsor_cc_mails.map((email, index) => (
                                        <Chip
                                            key={index}
                                            label={email}
                                            onDelete={() => handleDeleteEmail(email, setSponsorCcMails)}
                                            color="secondary"
                                            sx={{ marginRight: 0.5 }}
                                        />
                                    ))
                                }
                            />
                        </FormControl>
                    </Box>
                )}

                {email_assignee && (
                    <Box sx={{ mt: 2 }}>
                        <Typography>Add CC email addresses for assignees.</Typography>
                        <FormControl fullWidth>
                            <OutlinedInput
                                placeholder="Enter assignee CC email and press Enter"
                                value={assignee_cc_input}
                                onChange={(e) => setAssignee_cc_input(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddEmail(assignee_cc_input, setAssigneeCcMails, setAssignee_cc_input);
                                    }
                                }}
                                startAdornment={
                                    assignee_cc_mails.map((email, index) => (
                                        <Chip
                                            key={index}
                                            label={email}
                                            onDelete={() => handleDeleteEmail(email, setAssigneeCcMails)}
                                            color="secondary"
                                            sx={{ marginRight: 0.5 }}
                                        />
                                    ))
                                }
                            />
                        </FormControl>
                    </Box>
                )}

                <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
                    In case, you want to check emails first, enter your email address below in order to receive test emails.
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <FormControl fullWidth>
                        <OutlinedInput
                            placeholder="Enter test email and press Enter"
                            value={test_email_input}
                            onChange={handleTestEmailChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && isTestEmailValid && test_mails.length < 5) {
                                    e.preventDefault();
                                    addTestEmail();
                                }
                            }}
                            startAdornment={
                                test_mails.map((email, index) => (
                                    <Chip
                                        key={index}
                                        label={email}
                                        onDelete={() => handleDeleteEmail(email, setTestMails)}
                                        color="primary"
                                        sx={{ marginRight: 0.5 }}
                                    />
                                ))
                            }
                        />
                    </FormControl>
                    <Button 
                        variant="contained" 
                        color="success" 
                        onClick={handleTestEmail}
                        disabled={test_mails.length === 0 || isTestLoading}
                        sx={{ ml: 2 }}
                        startIcon={<EmailOutlined />}
                    >
                        {isTestLoading ? 'Sending...' : 'Test'}
                    </Button>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} color="error" disabled={isConfirmLoading}>
                    Cancel
                </Button>
                <Button 
                    onClick={handleSendMails} 
                    color="success" 
                    variant="contained"
                    disabled={isConfirmLoading}
                >
                    {isConfirmLoading ? 'Sending...' : 'Confirm'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EmailConfirmationModal;
