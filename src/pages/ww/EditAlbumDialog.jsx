import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export const EditAlbumDialog = (props) => {
  const { open, onClose, formData } = props;

  return (
    <Dialog>
      <DialogTitle>
        <Typography variant="body1" align="center">
          Remove any unwanted image
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box>{files}</Box>
      </DialogContent>
    </Dialog>
  );
};
