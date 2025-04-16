import React, { useState, useEffect } from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ImageViewModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ImageViewModal: React.FC<ImageViewModalProps> = ({ open, onClose, imageUrl }) => {
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!imageUrl) return;

    setIsLoading(true);
    const img = new Image();
    img.onload = () => {
      setImgDimensions({ width: img.width, height: img.height });
      setIsLoading(false);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  return (
    <Modal 
      open={open} 
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '90vw',
          height: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
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
            zIndex: 2,
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.9)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Image Container */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center', 
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Image */}
          <Box
            component="img"
            src={imageUrl}
            alt="Expanded View"
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: 1,
              // Show a subtle transition when loading
              opacity: isLoading ? 0.7 : 1,
              transition: 'opacity 0.3s ease-in-out',
            }}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default ImageViewModal;
