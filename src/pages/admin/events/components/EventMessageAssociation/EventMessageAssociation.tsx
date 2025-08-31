import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Divider,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  Message as MessageIcon,
} from '@mui/icons-material';

import { EventMessageAssociationProps } from './types';
import { useEventMessageAssociation } from './useEventMessageAssociation';
import MessageList from './MessageList';

// Common Components
import UserLookupComponent from '../../../../../components/common/UserLookup/UserLookupComponent';
import { USER_LOOKUP_PRESETS } from '../../../../../components/common/UserLookup/types';

const EventMessageAssociation: React.FC<EventMessageAssociationProps> = ({
  eventId,
  eventLink,
  eventName,
  open,
  onClose,
}) => {
  const theme = useTheme();
  
  const {
    eventMessages,
    loadingMessages,
    newMessage,
    selectedMessenger,
    editingMessage,
    editMessageText,
    setNewMessage,
    setSelectedMessenger,
    setEditMessageText,
    handleCreateMessage,
    handleEditMessage,
    handleUpdateMessage,
    handleDeleteMessage,
    handleCancelEdit,
    handleReorderMessages,
  } = useEventMessageAssociation({ eventId, eventLink, open });

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <MessageIcon color="primary" />
          <Typography variant="h5" component="div" fontWeight="bold">
            Message Association - {eventName}
          </Typography>
        </Box>
        
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DialogContentText sx={{ mb: 2 }}>
          Add, edit, or remove messages associated with this event. You can drag and drop to reorder messages.
        </DialogContentText>

        {/* Add New Message Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Add New Message</Typography>
          
          {/* Messenger Selection */}
          <Box sx={{ mb: 2 }}>
            <UserLookupComponent
              {...USER_LOOKUP_PRESETS.ASSIGNEE}
              label="Select Messenger (Optional)"
              placeholder="Search for messenger by name or email..."
              value={selectedMessenger}
              onChange={setSelectedMessenger}
              required={false}
            />
          </Box>

          {/* Message Input */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Enter your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              variant="outlined"
            />
            <Button
              variant="contained"
              onClick={handleCreateMessage}
              disabled={!newMessage.trim() || loadingMessages}
              sx={{ mt: 0.5, minWidth: 80 }}
            >
              Add
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Messages List with Drag & Drop */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <MessageList
            messages={eventMessages}
            loading={loadingMessages}
            editingMessage={editingMessage}
            editMessageText={editMessageText}
            onEditMessage={handleEditMessage}
            onUpdateMessage={handleUpdateMessage}
            onDeleteMessage={handleDeleteMessage}
            onCancelEdit={handleCancelEdit}
            onEditTextChange={setEditMessageText}
            onReorderMessages={handleReorderMessages}
            disabled={loadingMessages}
          />
        </Box>
      </DialogContent>
      
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="body2" component="span" color="text.secondary">
          {eventMessages.length} message{eventMessages.length !== 1 ? 's' : ''} currently associated with this event
        </Typography>
        
        <Button
          onClick={onClose}
          disabled={loadingMessages}
          color="primary"
          variant="contained"
          size="large"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventMessageAssociation;