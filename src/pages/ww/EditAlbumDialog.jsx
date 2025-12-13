import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useTranslation } from 'react-i18next';

export const EditAlbumDialog = (props) => {
  const { t } = useTranslation();
  const { open, onClose, formData } = props;

  return (
    <Dialog>
      <DialogTitle>
        <Typography variant="body1" align="center">
          {t('album.removeUnwantedImage')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box>{files}</Box>
      </DialogContent>
    </Dialog>
  );
};
