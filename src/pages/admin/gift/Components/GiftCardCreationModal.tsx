import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

interface GiftCardCreationModalProps {
    open: boolean
    onClose: () => void
}

const GiftCardCreationModal: React.FC<GiftCardCreationModalProps> = ({ open, onClose }) => {

    return (
        <Dialog open={open} fullWidth maxWidth='md'>
            <DialogTitle>Requested tree cards</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body1">Generating tree cards may take upto 10 to 15 mins based on requested number of tree cards. Please refresh or come back after sometime!</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default GiftCardCreationModal;