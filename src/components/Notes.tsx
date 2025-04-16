// src/components/Notes.tsx
import React, { useEffect, useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';

const MAX_CHARS = 1000;

interface NotesProps {
    open: boolean;
    initialText?: string;
    handleClose: () => void;
    onSave: (text: string) => void;
    title?: string; // Optional title prop for flexibility
}

const Notes: React.FC<NotesProps> = ({ open, handleClose, initialText, onSave, title = "Notes" }) => {
  const [text, setText] = useState(initialText || '');

  useEffect(() => {
    if (initialText) setText(initialText);
    else setText('');
  }, [open, initialText]);

  const handleSave = () => {
    onSave(text);
    handleClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_CHARS) {
      setText(e.target.value);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="notes-modal-title" aria-describedby="notes-modal-description">
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
        <Typography id="notes-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            {title}
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

export default Notes;