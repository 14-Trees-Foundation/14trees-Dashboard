import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { ImagePreviewModalProps } from '../types';

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ 
  open, 
  imageUrl, 
  onClose 
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogContent sx={{ p: 0 }}>
      <img
        src={imageUrl}
        alt="Preview"
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '80vh',
          objectFit: 'contain',
        }}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

export default ImagePreviewModal;