import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography
} from '@mui/material';
import { toast } from 'react-toastify';
import ApiClient from '../../api/apiClient/apiClient';
import { User } from '../../types/user';

interface EditUserEmailDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    userId?: number;
    recipientName: string;
    recipientEmail?: string;
    recipientCommunicationEmail?: string;
}

interface UpdateUserPayload {
    name: string;
    email: string;
    communication_email: string;
}

const EditUserEmailDialog: React.FC<EditUserEmailDialogProps> = ({
    open,
    onClose,
    onSubmit,
    userId,
    recipientName,
    recipientEmail,
    recipientCommunicationEmail
}) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<UpdateUserPayload>({
        name: recipientName || '',
        email: recipientEmail || '',
        communication_email: recipientCommunicationEmail || ''
    });

    // Reset form data when props change
    useEffect(() => {
        setFormData({
            name: recipientName || '',
            email: recipientEmail || '',
            communication_email: recipientCommunicationEmail || ''
        });
    }, [recipientName, recipientEmail, recipientCommunicationEmail]);

    const handleChange = (field: keyof UpdateUserPayload) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSubmit = async () => {
        // Check for valid user ID (must be a positive number)
        console.log('Submit clicked with userId:', userId);
        
        if (!userId || userId <= 0) {
            console.log('Invalid userId condition met:', { userId });
            toast.error('Cannot update user: Invalid or missing user ID');
            onClose(); // Close the dialog as we can't proceed
            return;
        }

        // Validate required fields
        if (!formData.name.trim()) {
            toast.error('Name is required');
            return;
        }

        setLoading(true);
        try {
            const apiClient = new ApiClient();
            // Only send the fields we want to update
            const userPayload = {
                id: userId,
                name: formData.name.trim(),
                email: formData.email.trim() || null,
                communication_email: formData.communication_email.trim() || null
            } as User;
            
            console.log('Attempting to update user with payload:', userPayload);
            
            try {
                const response = await apiClient.updateUser(userPayload);
                console.log('Update user API response:', response);
            } catch (apiError: any) {
                console.error('API Error details:', {
                    error: apiError,
                    message: apiError.message,
                    response: apiError.response,
                    status: apiError.response?.status,
                    data: apiError.response?.data
                });
                throw apiError;
            }
            
            toast.success('User details updated successfully');
            onSubmit();
            onClose();
        } catch (error: any) {
            console.error('Error in handleSubmit:', error);
            toast.error(error.message || 'Failed to update user details');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Edit User Details</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Recipient Name
                        </Typography>
                        <TextField
                            value={formData.name}
                            onChange={handleChange('name')}
                            fullWidth
                            placeholder="Enter recipient name"
                        />
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Recipient Email
                        </Typography>
                        <TextField
                            value={formData.email}
                            onChange={handleChange('email')}
                            fullWidth
                            placeholder="Enter recipient email"
                            type="email"
                        />
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Communication Email
                        </Typography>
                        <TextField
                            value={formData.communication_email}
                            onChange={handleChange('communication_email')}
                            fullWidth
                            placeholder="Enter communication email"
                            type="email"
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} color="error" variant="outlined">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    color="success"
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditUserEmailDialog; 