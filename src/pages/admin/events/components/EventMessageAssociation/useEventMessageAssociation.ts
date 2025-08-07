import { useState, useEffect } from 'react';
import { EventMessage } from '../../../../../types/event';
import { User } from '../../../../../components/common/UserLookup/types';
import ApiClient from '../../../../../api/apiClient/apiClient';
import { toast } from 'react-toastify';
import { UseEventMessageAssociationProps, UseEventMessageAssociationReturn } from './types';

export const useEventMessageAssociation = ({ 
  eventId,
  eventLink, 
  open 
}: UseEventMessageAssociationProps): UseEventMessageAssociationReturn => {
  const [eventMessages, setEventMessages] = useState<EventMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [selectedMessenger, setSelectedMessenger] = useState<User | null>(null);
  const [editingMessage, setEditingMessage] = useState<EventMessage | null>(null);
  const [editMessageText, setEditMessageText] = useState('');

  const apiClient = new ApiClient();

  useEffect(() => {
    if (open && eventLink) {
      loadEventMessages();
    }
  }, [open, eventLink]);

  const loadEventMessages = async () => {
    if (!eventLink) return;
    
    setLoadingMessages(true);
    try {
      const messages = await apiClient.events.getEventMessages(eventLink);
      setEventMessages(messages);
    } catch (error: any) {
      toast.error(`Failed to load messages: ${error.message}`);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleCreateMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const createdMessage = await apiClient.events.createEventMessage(
        eventId,
        newMessage.trim(),
        selectedMessenger?.id || undefined
      );
      setEventMessages(prev => [...prev, createdMessage]);
      setNewMessage('');
      setSelectedMessenger(null);
      toast.success('Message added successfully!');
    } catch (error: any) {
      toast.error(`Failed to create message: ${error.message}`);
    }
  };

  const handleEditMessage = (message: EventMessage) => {
    setEditingMessage(message);
    setEditMessageText(message.message);
  };

  const handleUpdateMessage = async () => {
    if (!editingMessage || !editMessageText.trim()) return;

    try {
      const updatedMessage = await apiClient.events.updateEventMessage(
        editingMessage.id,
        editMessageText.trim()
      );
      setEventMessages(prev => 
        prev.map(msg => msg.id === editingMessage.id ? updatedMessage : msg)
      );
      setEditingMessage(null);
      setEditMessageText('');
      toast.success('Message updated successfully!');
    } catch (error: any) {
      toast.error(`Failed to update message: ${error.message}`);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    try {
      await apiClient.events.deleteEventMessage(messageId);
      setEventMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success('Message deleted successfully!');
    } catch (error: any) {
      toast.error(`Failed to delete message: ${error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setEditMessageText('');
  };

  const handleReorderMessages = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(eventMessages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update local state immediately for better UX
    setEventMessages(items);

    // Update sequences
    const messageSequences = items.map((message, index) => ({
      id: message.id,
      sequence: index,
    }));

    try {
      await apiClient.events.reorderEventMessages(eventId, messageSequences);
      toast.success('Messages reordered successfully!');
    } catch (error: any) {
      toast.error(`Failed to reorder messages: ${error.message}`);
      // Reload messages on error
      await loadEventMessages();
    }
  };

  return {
    // State
    eventMessages,
    loadingMessages,
    newMessage,
    selectedMessenger,
    editingMessage,
    editMessageText,
    
    // Setters
    setNewMessage,
    setSelectedMessenger,
    setEditMessageText,
    
    // Actions
    handleCreateMessage,
    handleEditMessage,
    handleUpdateMessage,
    handleDeleteMessage,
    handleCancelEdit,
    handleReorderMessages,
  };
};