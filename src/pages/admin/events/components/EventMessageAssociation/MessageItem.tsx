import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Box,
  Typography,
  Avatar,
  Chip,
  Card,
  CardContent,
  Tooltip,
} from '@mui/material';
import {
  Edit,
  Delete,
  Save,
  Cancel,
  DragIndicator,
  Person,
} from '@mui/icons-material';
import { EventMessage } from '../../../../../types/event';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';

interface MessageItemProps {
  message: EventMessage;
  index: number;
  isEditing: boolean;
  editText: string;
  onEdit: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  onCancel: () => void;
  onEditTextChange: (text: string) => void;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  isDragging: boolean;
  disabled?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  index,
  isEditing,
  editText,
  onEdit,
  onUpdate,
  onDelete,
  onCancel,
  onEditTextChange,
  dragHandleProps,
  isDragging,
  disabled = false,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getMessengerDisplay = () => {
    if (message.user_name) {
      return {
        name: message.user_name,
        avatar: message.user_profile_image,
        email: message.user_email,
      };
    }
    return {
      name: 'System',
      avatar: null,
      email: null,
    };
  };

  const messenger = getMessengerDisplay();

  return (
    <Card
      sx={{
        mb: 1,
        boxShadow: isDragging ? 4 : 1,
        backgroundColor: isDragging ? '#f0f0f0' : 'white',
        transition: 'box-shadow 0.2s ease, background-color 0.2s ease',
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" alignItems="flex-start" gap={2}>
          {/* Drag Handle */}
          <Box
            {...dragHandleProps}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: isDragging ? 'grabbing' : 'grab',
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            <DragIndicator fontSize="small" />
          </Box>

          {/* Sequence Number */}
          <Chip
            label={`#${message.sequence !== undefined ? message.sequence + 1 : index + 1}`}
            size="small"
            color="primary"
            variant="outlined"
          />

          {/* Message Content */}
          <Box flex={1}>
            {/* Messenger Info */}
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Avatar
                src={messenger.avatar || undefined}
                sx={{ width: 24, height: 24 }}
              >
                {messenger.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="caption" color="textSecondary">
                {messenger.name}
                {messenger.email && ` (${messenger.email})`}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                • {formatDate(message.created_at)}
              </Typography>
            </Box>

            {/* Message Text */}
            {isEditing ? (
              <TextField
                fullWidth
                multiline
                rows={3}
                value={editText}
                onChange={(e) => onEditTextChange(e.target.value)}
                variant="outlined"
                size="small"
                autoFocus
              />
            ) : (
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {message.message}
              </Typography>
            )}

            {/* Updated timestamp */}
            {message.updated_at && message.updated_at !== message.created_at && (
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                Last updated: {formatDate(message.updated_at)}
              </Typography>
            )}
          </Box>

          {/* Action Buttons */}
          <Box display="flex" flexDirection="column" gap={0.5}>
            {isEditing ? (
              <>
                <Tooltip title="Save changes">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={onUpdate}
                    disabled={disabled || !editText.trim()}
                  >
                    <Save fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancel editing">
                  <IconButton
                    size="small"
                    onClick={onCancel}
                    disabled={disabled}
                  >
                    <Cancel fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="Edit message">
                  <IconButton
                    size="small"
                    onClick={onEdit}
                    disabled={disabled}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete message">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={onDelete}
                    disabled={disabled}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MessageItem;