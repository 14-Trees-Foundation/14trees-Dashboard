import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import { Donation } from '../../../../types/donation';

interface NotesModalProps {
  open: boolean;
  onClose: () => void;
  donation: Donation | null;
  onSave?: (donationId: number, notes: string) => Promise<void>;
}

const NotesModal: React.FC<NotesModalProps> = ({ open, onClose, donation, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState('');
  const [originalNotes, setOriginalNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize notes when donation changes or modal opens
  useEffect(() => {
    if (donation && open) {
      const currentNotes = donation.notes || '';
      setNotes(currentNotes);
      setOriginalNotes(currentNotes);
      setIsEditing(false);
      setError(null);
      setHasUnsavedChanges(false);
    }
  }, [donation, open]);

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(notes !== originalNotes);
  }, [notes, originalNotes]);

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmDiscard = window.confirm('You have unsaved changes. Are you sure you want to discard them?');
      if (!confirmDiscard) return;
    }
    
    setNotes(originalNotes);
    setIsEditing(false);
    setError(null);
    setHasUnsavedChanges(false);
  };

  const handleSave = async () => {
    if (!donation || !onSave) return;

    setIsSaving(true);
    setError(null);

    try {
      await onSave(donation.id, notes);
      setOriginalNotes(notes);
      setIsEditing(false);
      setHasUnsavedChanges(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save notes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirmClose) return;
    }
    
    setIsEditing(false);
    setError(null);
    setHasUnsavedChanges(false);
    onClose();
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(event.target.value);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          Notes - Donation #{donation?.id}
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box sx={{ minHeight: 200, py: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {isEditing ? (
            <TextField
              multiline
              rows={8}
              fullWidth
              value={notes}
              onChange={handleNotesChange}
              placeholder="Add notes about this donation (e.g., fulfillment status, communication logs, special instructions)..."
              variant="outlined"
              sx={{ mb: 2 }}
              disabled={isSaving}
            />
          ) : (
            <Box sx={{ minHeight: 200 }}>
              {notes && notes.trim() !== '' ? (
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                  {notes}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
                  No notes available for this donation.
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        {isEditing ? (
          <>
            <Button 
              onClick={handleCancel} 
              disabled={isSaving}
              color="secondary"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              variant="contained" 
              color="primary"
              disabled={isSaving || !hasUnsavedChanges}
              startIcon={isSaving ? <CircularProgress size={16} /> : null}
            >
              {isSaving ? 'Saving...' : 'Save Notes'}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleClose} color="secondary">
              Close
            </Button>
            {onSave && (
              <Button 
                onClick={handleEdit} 
                variant="contained" 
                color="primary"
              >
                Edit Notes
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default NotesModal;