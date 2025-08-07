import React from 'react';
import {
  List,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { EventMessage } from '../../../../../types/event';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: EventMessage[];
  loading: boolean;
  editingMessage: EventMessage | null;
  editMessageText: string;
  onEditMessage: (message: EventMessage) => void;
  onUpdateMessage: () => void;
  onDeleteMessage: (messageId: number) => void;
  onCancelEdit: () => void;
  onEditTextChange: (text: string) => void;
  onReorderMessages: (result: DropResult) => void;
  disabled?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  loading,
  editingMessage,
  editMessageText,
  onEditMessage,
  onUpdateMessage,
  onDeleteMessage,
  onCancelEdit,
  onEditTextChange,
  onReorderMessages,
  disabled = false,
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress />
      </Box>
    );
  }

  if (messages.length === 0) {
    return (
      <Alert severity="info">
        No messages for this event yet. Add the first message above.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Messages ({messages.length})
      </Typography>
      
      <DragDropContext onDragEnd={onReorderMessages}>
        <Droppable droppableId="messages">
          {(provided, snapshot) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{
                backgroundColor: snapshot.isDraggingOver ? '#f5f5f5' : 'transparent',
                borderRadius: 1,
                transition: 'background-color 0.2s ease',
                minHeight: 100,
              }}
            >
              {messages.map((message, index) => (
                <Draggable
                  key={message.id}
                  draggableId={message.id.toString()}
                  index={index}
                  isDragDisabled={disabled || !!editingMessage}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        ...provided.draggableProps.style,
                        transform: snapshot.isDragging 
                          ? `${provided.draggableProps.style?.transform} rotate(2deg)`
                          : provided.draggableProps.style?.transform,
                      }}
                    >
                      <MessageItem
                        message={message}
                        index={index}
                        isEditing={editingMessage?.id === message.id}
                        editText={editMessageText}
                        onEdit={() => onEditMessage(message)}
                        onUpdate={onUpdateMessage}
                        onDelete={() => onDeleteMessage(message.id)}
                        onCancel={onCancelEdit}
                        onEditTextChange={onEditTextChange}
                        dragHandleProps={provided.dragHandleProps}
                        isDragging={snapshot.isDragging}
                        disabled={disabled}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default MessageList;