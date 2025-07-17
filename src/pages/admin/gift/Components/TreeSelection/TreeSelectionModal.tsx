import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { FC, ReactNode } from "react";

interface TreeSelectionModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    children: ReactNode;
}

const TreeSelectionModal: FC<TreeSelectionModalProps> = ({
    open,
    onClose,
    onSubmit,
    children
}) => {
    return (
        <Dialog open={open} fullWidth maxWidth="xl">
            <DialogTitle>Tree Selection</DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error" variant="outlined">
                    Cancel
                </Button>
                <Button onClick={onSubmit} color="success" variant="contained">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TreeSelectionModal;