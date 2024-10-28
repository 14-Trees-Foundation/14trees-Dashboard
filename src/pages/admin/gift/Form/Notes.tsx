import React, { useEffect, useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';

const MAX_CHARS = 1000;

interface GiftRequestNotesProps {
    open: boolean
    initialText?: string
    handleClose: () => void
    onSave: (text: string) => void
}

const GiftRequestNotes: React.FC<GiftRequestNotesProps> = ({ open, handleClose, initialText, onSave }) => {
  const [text, setText] = useState(initialText || '');

  useEffect(() => {
    if (initialText) setText(initialText);
    else setText('');
    
  }, [initialText])

  const handleSave = () => {
    onSave(text);
    handleClose();
  };

  const handleChange = (e: any) => {
    if (e.target.value.length <= MAX_CHARS) {
      setText(e.target.value);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="edit-modal-title" aria-describedby="edit-modal-description">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="edit-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            Gift Request Notes
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={15}
          variant="outlined"
          placeholder='Notes...'
          value={text}
          type='text'
          onChange={handleChange}
          sx={{ mb: 1 }}
        />
        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'right', mb: 3 }}>
          {MAX_CHARS - text.length} characters remaining
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default GiftRequestNotes;
