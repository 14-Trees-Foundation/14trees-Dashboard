import { DialogTitle } from "@mui/material";
import { DialogContentText } from "@mui/material";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import { Button } from "@mui/material";


interface UnassignConfirmationDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    unassignAll: boolean;
    handleUnassign: (unassignAll: boolean) => void;
    loading: boolean;
}


const UnassignConfirmationDialog = ({ open, setOpen, unassignAll, handleUnassign, loading }: UnassignConfirmationDialogProps) => {
    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Unassign Trees</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to unassign {unassignAll ? "all" : "selected"} trees?
                </DialogContentText>
                <DialogContentText>
                    This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="error" sx={{ textTransform: 'none' }} onClick={() => setOpen(false)}>Cancel</Button>
                <Button variant="contained" color="success" sx={{ textTransform: 'none' }} onClick={() => handleUnassign(unassignAll)} disabled={loading}>{loading ? "Unassigning..." : "Yes, Unassign"}</Button>
            </DialogActions>
        </Dialog>
    )
}           

export default UnassignConfirmationDialog;