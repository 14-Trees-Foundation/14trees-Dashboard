import React, { useState } from 'react';
import { Button, IconButton, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Preview, Delete } from '@mui/icons-material';

interface FileInputProps {
  file: File | null
  onFileChange: (file: File | null) => void
}

const FileInputComponent: React.FC<FileInputProps> = ({ file, onFileChange }) => {

  const [preview, setPreview] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target?.files && event.target.files.length > 0 ? event.target.files[0] : null;
    if (selectedFile) {
      onFileChange(selectedFile);
      setPreview(false);
    }
  };

  const handleRemoveFile = () => {
    onFileChange(null);
    setPreview(false);
  };

  const togglePreview = () => {
    setPreview((prev) => !prev);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      <Typography>Upload the Image/Pdf of payment</Typography>
      {!file && (
        <Button
          variant="outlined"
          component="label"
          style={{ maxWidth: 200 }}
        >
          Upload File
          <input
            type="file"
            hidden
            accept="image/*,application/pdf"
            onChange={handleFileChange}
          />
        </Button>
      )}

      {file && (
        <Box display="flex" alignItems="center" justifyContent='space-between'>
          <Typography variant="body2">{file.name}</Typography>

          <Box display="flex" alignItems="center" gap={1}>
            <IconButton color="primary" onClick={togglePreview}>
              <Preview />
            </IconButton>
            <IconButton color="error" onClick={handleRemoveFile}>
              <Delete />
            </IconButton>
          </Box>
        </Box>
      )}

      <Dialog open={preview} fullWidth maxWidth="lg">
        <DialogTitle>Payment Proof</DialogTitle>
        <DialogContent dividers>
          {file && 
          <Box 
            width="100%"
            maxHeight="65vh"
            display="flex"
            alignItems="center"
            p={2} 
          >
            {file.type.includes('image') ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            ) : file.type === 'application/pdf' ? (
              <iframe
                src={URL.createObjectURL(file)}
                title="PDF Preview"
                style={{ border: 'none', width: '100%', height: '65vh', display: 'block' }}
              ></iframe>
            ) : (
              <Typography variant="body2" color="error">
                Unsupported file type
              </Typography>
            )}
          </Box>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setPreview(false) }} color="error" variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FileInputComponent;
