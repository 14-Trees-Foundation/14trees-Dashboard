import React, { useState } from 'react';
import { Box, Modal, ImageList, ImageListItem, IconButton, ImageListItemBar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getHumanReadableDate } from '../../../../helpers/utils';

interface TimelineItemProps {
  image: string;
  date: string;
  status: string;
}

const ImageGallery = ({ images }: { images: TimelineItemProps[] }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const displayImages = images.slice(0, 2);

  return (
    <div>
      {/* Square Container for Displaying Images */}
      <Box
        onClick={handleOpen}
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(displayImages.length, 2)}, 1fr)`,
          gridTemplateRows: `repeat(1, 1fr)`,
          gap: 1,
          cursor: 'pointer',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        {displayImages.map((image, index) => (
          <Box
            key={index}
            component="img"
            src={image.image || 'https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory1.jpg'}
            alt={`image-${index}`}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ))}
      </Box>

      {/* Modal for Viewing All Images */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            maxHeight: '80vh',
            p: 4,
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <ImageList cols={Math.min(images.length, 3)} gap={8} sx={{ maxHeight: '80vh' }}>
            {images.map((image, index) => (
              <ImageListItem key={index}>
                <img src={image.image || 'https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory1.jpg'} alt={`image-${index}`} />
                <ImageListItemBar
                  title={getHumanReadableDate(image.date)}
                  subtitle={<span>{image.status.slice(0, 1).toUpperCase() + image.status.slice(1)}</span>}
                  position="below"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      </Modal>
    </div>
  );
};

export default ImageGallery;
