import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Event } from "../../../../types/event";

interface DeleteEventDialogProps {
  open: boolean;
  event: Event | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteEventDialog = ({
  open,
  event,
  onClose,
  onConfirm,
}: DeleteEventDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Do you want to delete event {event?.name || `ID: ${event?.id}`}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose} color="error">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="success"
          autoFocus
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};