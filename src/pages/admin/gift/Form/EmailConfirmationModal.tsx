import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Chip, Typography, Button, FormControl, FormControlLabel, Checkbox, OutlinedInput } from '@mui/material';

interface EmailConfirmationModalProps {
    sponsorMail?: string;
    open: boolean;
    onClose: () => void;
    onSubmit: (testMails: string[], ccMails: string[], attachCard: boolean) => void;
}

const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({ sponsorMail, open, onClose, onSubmit }) => {
    const [toEmails, setToEmails] = useState<string[]>([]);
    const [ccEmails, setCcEmails] = useState<string[]>(sponsorMail ? [sponsorMail] : []);
    const [emailInput, setEmailInput] = useState('');
    const [ccInput, setCcInput] = useState('');
    const [attachCards, setAttachCards] = useState(false);

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
        onSubmit(toEmails, ccEmails, attachCards);
    };

    return (
        <Dialog open={open} fullWidth maxWidth="lg">
            <DialogTitle>Send Emails</DialogTitle>
            <DialogContent dividers>
                <Typography variant="subtitle1" gutterBottom>
                    Add recipient and CC email addresses.
                </Typography>

                {/* CC Email Addresses */}
                <FormControl fullWidth margin="normal">
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

                {/* Recipient Email Addresses */}
                <FormControl fullWidth margin="normal">
                    <OutlinedInput
                        placeholder="Enter recipient email and press Enter"
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

                <FormControl component="fieldset" sx={{ mt: 3 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={attachCards}
                                onChange={(e) => setAttachCards(e.target.checked)}
                                name="manual"
                            />
                        }
                        label="Do you want to send gift card image as an attachment in emails?"
                    />
                </FormControl>

                <Typography variant="subtitle1" style={{ marginTop: '16px' }}>
                    Are you sure you want to send emails to these users?
                </Typography>
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
