import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    Box
} from '@mui/material';

interface AutoProcessConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

const AutoProcessConfirmationModal: React.FC<AutoProcessConfirmationModalProps> = ({
    open,
    onClose,
    onConfirm,
    loading = false
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Auto Process Confirmation</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" gutterBottom>
                        This request will be automatically processed with the following steps:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                        <Typography component="li" variant="body2" gutterBottom>
                            Trees will be picked from pre-defined plots
                        </Typography>
                        <Typography component="li" variant="body2" gutterBottom>
                            Trees will be assigned to recipients
                        </Typography>
                        <Typography component="li" variant="body2" gutterBottom>
                            Any remaining trees will be assigned to the sponsor
                        </Typography>
                    </Box>
                </Box>
                <DialogContentText color="warning.main">
                    Please confirm that you want to proceed with the auto-processing.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={onClose} 
                    color="error" 
                    variant="outlined"
                    disabled={loading}
                    style={{ textTransform: 'none' }}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={onConfirm} 
                    color="success" 
                    variant="contained"
                    disabled={loading}
                    style={{ textTransform: 'none' }}
                >
                    {loading ? 'Processing...' : 'Confirm Auto Process'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AutoProcessConfirmationModal;