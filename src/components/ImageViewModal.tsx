import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ImageViewModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ImageViewModal: React.FC<ImageViewModalProps> = ({ open, onClose, imageUrl }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'relative',
          maxWidth: '90%',
          maxHeight: '90%',
          margin: 'auto',
          mt: '5vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden', // Ensures no overflow
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'grey.600',
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Image */}
        <Box
          component="img"
          src={imageUrl}
          alt="Expanded View"
          sx={{
            maxWidth: '90%',
            maxHeight: '90%',
            objectFit: 'contain', // Ensures the image is scaled to fit
            borderRadius: 1,
          }}
        />
      </Box>
    </Modal>
  );
};

export default ImageViewModal;
