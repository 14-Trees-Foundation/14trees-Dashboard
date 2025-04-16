import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    SelectChangeEvent,
    Chip,
    OutlinedInput,
    Typography
} from "@mui/material";
import { EmailTemplate as ApiEmailTemplate } from "../../types/email_template";
import { GiftRedeemTransaction } from "../../types/gift_redeem_transaction";
import ApiClient from "../../api/apiClient/apiClient";

interface EmailDialogProps {
    open: boolean;
    onClose: () => void;
    transaction: GiftRedeemTransaction;
}

interface SendEmailPayload {
    recipient_email: string;
    cc_emails: string[];
    event_type: string;
}

const EmailDialog: React.FC<EmailDialogProps> = ({ open, onClose, transaction }) => {
    const [loading, setLoading] = useState(false);
    const [templates, setTemplates] = useState<ApiEmailTemplate[]>([]);
    const [formData, setFormData] = useState<SendEmailPayload>({
        recipient_email: transaction.recipient_email || '',
        cc_emails: [],
        event_type: ''
    });
    const [ccEmailInput, setCcEmailInput] = useState('');
    const [errors, setErrors] = useState<Partial<SendEmailPayload>>({});

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const apiClient = new ApiClient();
                const templates = await apiClient.getEmailTemplates();
                const uniqueTemplates: ApiEmailTemplate[]
                    = templates
                        .filter((template, index, self) => self.findIndex(item => item.event_type === template.event_type) === index);

                setTemplates(uniqueTemplates);
                setFormData(prev => ({ ...prev, event_type: uniqueTemplates[0]?.event_type || '' }));
            } catch (error) {
                toast.error("Failed to fetch email templates");
            }
        };
        fetchTemplates();
    }, []);

    const validateForm = () => {
        const newErrors: Partial<SendEmailPayload> = {};
        if (!formData.recipient_email) {
            newErrors.recipient_email = 'Recipient email is required';
        }
        if (!formData.event_type) {
            newErrors.event_type = 'Email template is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendEmail = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const apiClient = new ApiClient();
            await apiClient.sendEmailToGiftTransaction(transaction.id, formData.event_type, formData.recipient_email, formData.cc_emails);
            toast.success("Email sent successfully");
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to send email");
        } finally {
            setLoading(false);
        }
    };

    const handleTextChange = (field: keyof SendEmailPayload) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handleSelectChange = (event: SelectChangeEvent) => {
        setFormData(prev => ({
            ...prev,
            event_type: event.target.value
        }));
        if (errors.event_type) {
            setErrors(prev => ({
                ...prev,
                event_type: undefined
            }));
        }
    };

    const handleCcEmailKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const email = ccEmailInput.trim();
            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                if (!formData.cc_emails.includes(email)) {
                    setFormData(prev => ({
                        ...prev,
                        cc_emails: [...prev.cc_emails, email]
                    }));
                }
                setCcEmailInput('');
            } else if (email) {
                toast.error('Please enter a valid email address');
            }
        }
    };

    const handleDeleteCcEmail = (emailToDelete: string) => {
        setFormData(prev => ({
            ...prev,
            cc_emails: prev.cc_emails.filter(email => email !== emailToDelete)
        }));
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Send Email</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Enter the recipient's email address
                        </Typography>
                        <TextField
                            label="Recipient Email"
                            value={formData.recipient_email}
                            onChange={handleTextChange('recipient_email')}
                            error={!!errors.recipient_email}
                            helperText={errors.recipient_email}
                            fullWidth
                        />
                    </Box>

                    <Box mt={2}>
                        <FormControl fullWidth>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                You can mention CC email addresses to send a copy of the email to them. To add multiple CC email addresses, press Enter after each email address.
                            </Typography>
                            <OutlinedInput
                                placeholder="Enter CC email and press Enter"
                                value={ccEmailInput}
                                onChange={(e) => setCcEmailInput(e.target.value)}
                                onKeyDown={handleCcEmailKeyDown}
                                fullWidth
                            />
                            <FormHelperText>
                                Type email and press Enter to add
                            </FormHelperText>
                            <Box sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 0.5,
                                mt: 1,
                                minHeight: formData.cc_emails.length ? '32px' : 0
                            }}>
                                {formData.cc_emails.map((email, index) => (
                                    <Chip
                                        key={index}
                                        label={email}
                                        onDelete={() => handleDeleteCcEmail(email)}
                                        color="success"
                                        size="small"
                                    />
                                ))}
                            </Box>
                        </FormControl>
                    </Box>

                    <Box mt={2}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Select the email template to send
                        </Typography>
                        <FormControl
                            fullWidth
                            error={!!errors.event_type}
                        >
                            <InputLabel>Email Template</InputLabel>
                            <Select
                                value={formData.event_type}
                                onChange={handleSelectChange}
                                label="Email Template"
                            >
                                {templates.map(template => (
                                    <MenuItem key={template.id} value={template.event_type}>
                                        {template.event_name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.event_type && (
                                <FormHelperText>{errors.event_type}</FormHelperText>
                            )}
                        </FormControl>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button variant="outlined" onClick={onClose} color="error">
                    Cancel
                </Button>
                <Button
                    onClick={handleSendEmail}
                    variant="contained"
                    color="success"
                    disabled={loading}
                    sx={{ textTransform: 'none' }}
                >
                    {loading ? 'Sending...' : 'Send Email'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EmailDialog; 