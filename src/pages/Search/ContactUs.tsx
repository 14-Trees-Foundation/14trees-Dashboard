import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
  Box,
} from '@mui/material';

const ContactUs: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log({ name, email, feedback });
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Contact Us
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Contact Us</DialogTitle>
        <DialogContent dividers>
        <Typography variant="h6" gutterBottom>
            We value your feedback
          </Typography>
          <Typography variant="body2" gutterBottom>
            Please provide your feedback below. We will use your feedback to improve our services.
          </Typography>
          <TextField
            margin="dense"
            label="Feedback"
            type="text"
            fullWidth
            multiline
            rows={5}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Contact Details
            </Typography>
            <Typography variant="body2" gutterBottom>
              Please provide your contact details so we can reach back to you if needed.
            </Typography>
            <TextField
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error" variant='outlined'>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="success" variant='contained'>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ContactUs;