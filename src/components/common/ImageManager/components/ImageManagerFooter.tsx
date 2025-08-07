import React from 'react';
import {
  DialogActions,
  Button,
  Typography,
  useTheme,
} from '@mui/material';

interface ImageManagerFooterProps {
  imageCount: number;
  uploading: boolean;
  onClose: () => void;
  entityType?: string;
}

const ImageManagerFooter: React.FC<ImageManagerFooterProps> = ({ 
  imageCount, 
  uploading, 
  onClose,
  entityType = 'entity'
}) => {
  const theme = useTheme();

  return (
    <DialogActions
      sx={{
        px: 3,
        py: 2,
        borderTop: `1px solid ${theme.palette.divider}`,
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="body2" component="span" color="text.secondary">
        {imageCount} image{imageCount !== 1 ? 's' : ''} currently associated with this {entityType}
      </Typography>
      
      <Button
        onClick={onClose}
        disabled={uploading}
        color="primary"
        variant="contained"
        size="large"
      >
        Done
      </Button>
    </DialogActions>
  );
};

export default ImageManagerFooter;