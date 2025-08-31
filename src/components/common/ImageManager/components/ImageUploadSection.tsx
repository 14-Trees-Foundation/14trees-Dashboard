import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

interface ImageUploadSectionProps {
  selectedFiles: File[];
  uploading: boolean;
  uploadProgress: number;
  dragOver: boolean;
  handleDrop: (event: React.DragEvent) => void;
  handleDragOver: (event: React.DragEvent) => void;
  handleDragLeave: (event: React.DragEvent) => void;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeSelectedFile: (index: number) => void;
  uploadImages: () => Promise<void>;
  acceptedFileTypes?: string;
  supportedFormats?: string;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  selectedFiles,
  uploading,
  uploadProgress,
  dragOver,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleFileSelect,
  removeSelectedFile,
  uploadImages,
  acceptedFileTypes = "image/*",
  supportedFormats = "JPG, PNG, GIF, WebP",
}) => {
  return (
    <Grid item xs={12}>
      <Typography variant="subtitle1" gutterBottom>
        Upload New Images
      </Typography>
      
      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        sx={{
          border: `2px dashed ${dragOver ? '#1976d2' : '#ccc'}`,
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          backgroundColor: dragOver ? '#f5f5f5' : 'transparent',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <CloudUpload sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
        <Typography variant="body1" gutterBottom>
          Drag & drop images here or click to select
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Supports: {supportedFormats}
        </Typography>
        
        <input
          id="file-input"
          type="file"
          multiple
          accept={acceptedFileTypes}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </Box>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>
            Selected Files ({selectedFiles.length})
          </Typography>
          <Grid container spacing={1}>
            {selectedFiles.map((file, index) => (
              <Grid item key={index}>
                <Chip
                  label={file.name}
                  onDelete={() => removeSelectedFile(index)}
                  size="small"
                />
              </Grid>
            ))}
          </Grid>
          
          <Box mt={2}>
            <Button
              variant="contained"
              onClick={uploadImages}
              disabled={uploading}
              startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
            >
              {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} Images`}
            </Button>
          </Box>
          
          {uploading && (
            <Box mt={1}>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}
        </Box>
      )}
    </Grid>
  );
};

export default ImageUploadSection;