import React from 'react';
import { Avatar, Button, Grid, Typography } from '@mui/material';

interface ImageUploadSectionProps {
  currentImageUrl?: string;
  uploadedImage?: File;
  imageUrls: string[];
  showAssignedFields: boolean;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageSelectionModalOpen: () => void;
  onRemoveImage: () => void;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  currentImageUrl,
  uploadedImage,
  imageUrls,
  showAssignedFields,
  onImageChange,
  onImageSelectionModalOpen,
  onRemoveImage,
}) => {
  const getImageSrc = () => {
    if (uploadedImage) {
      return URL.createObjectURL(uploadedImage);
    }
    return currentImageUrl;
  };

  return (
    <Grid item xs={12}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Avatar
          src={getImageSrc()}
          alt="User"
          sx={{ width: 80, height: 80, marginRight: 2 }}
        />
        <Button 
          variant="outlined" 
          component="label" 
          color='success' 
          sx={{ marginRight: 2, textTransform: 'none' }}
        >
          Upload {showAssignedFields ? "Assignee" : "Recipient"} Image
          <input
            value={''}
            type="file"
            hidden
            accept="image/*"
            onChange={onImageChange}
          />
        </Button>
        <Typography sx={{ mr: 2 }}>OR</Typography>
        {imageUrls.length > 0 && (
          <Button 
            variant="outlined" 
            component="label" 
            color='success' 
            sx={{ marginRight: 2, textTransform: 'none' }} 
            onClick={onImageSelectionModalOpen}
          >
            Choose from webscraped URL
          </Button>
        )}
        {(currentImageUrl || uploadedImage) && (
          <Button 
            variant="outlined" 
            component="label" 
            color='error' 
            sx={{ textTransform: 'none' }} 
            onClick={onRemoveImage}
          >
            Remove Image
          </Button>
        )}
      </div>
    </Grid>
  );
};

export default ImageUploadSection;