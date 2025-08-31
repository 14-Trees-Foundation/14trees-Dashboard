import { EventMessage } from '../../../../../types/event';
import { User } from '../../../../../components/common/UserLookup/types';

export interface EventMessageAssociationProps {
  eventId: number;
  eventLink: string;
  eventName: string;
  open: boolean;
  onClose: () => void;
}

export interface UseEventMessageAssociationProps {
  eventId: number;
  eventLink: string;
  open: boolean;
}

export interface UseEventMessageAssociationReturn {
  // State
  eventMessages: EventMessage[];
  loadingMessages: boolean;
  newMessage: string;
  selectedMessenger: User | null;
  editingMessage: EventMessage | null;
  editMessageText: string;
  
  // Setters
  setNewMessage: (message: string) => void;
  setSelectedMessenger: (messenger: User | null) => void;
  setEditMessageText: (text: string) => void;
  
  // Actions
  handleCreateMessage: () => void;
  handleEditMessage: (message: EventMessage) => void;
  handleUpdateMessage: () => void;
  handleDeleteMessage: (messageId: number) => void;
  handleCancelEdit: () => void;
  handleReorderMessages: (result: any) => void;
}