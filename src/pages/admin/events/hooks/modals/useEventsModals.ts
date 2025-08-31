import { useState } from "react";
import { Event } from "../../../../../types/event";

export const useEventsModals = () => {
  // Event Modal
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [eventModalMode, setEventModalMode] = useState<'add' | 'edit'>('add');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Delete Modal
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Event | null>(null);

  // Association Modals
  const [imagesModalOpen, setImagesModalOpen] = useState(false);
  const [treesModalOpen, setTreesModalOpen] = useState(false);
  const [messagesModalOpen, setMessagesModalOpen] = useState(false);

  // Menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMenuEvent, setSelectedMenuEvent] = useState<Event | null>(null);

  const handleAddModalOpen = () => {
    setEventModalMode('add');
    setSelectedEvent(null);
    setEventModalOpen(true);
  };

  const handleEditModalOpen = (event: Event) => {
    setEventModalMode('edit');
    setSelectedEvent(event);
    setEventModalOpen(true);
  };

  const handleEventModalClose = () => setEventModalOpen(false);

  const handleDeleteEvent = (row: Event) => {
    setOpenDeleteModal(true);
    setSelectedItem(row);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, eventData: Event) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedMenuEvent(eventData);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedMenuEvent(null);
  };

  const handleImagesModalOpen = () => {
    setImagesModalOpen(true);
    setMenuAnchorEl(null);
  };

  const handleTreesModalOpen = () => {
    setTreesModalOpen(true);
    setMenuAnchorEl(null);
  };

  const handleMessagesModalOpen = () => {
    setMessagesModalOpen(true);
    setMenuAnchorEl(null);
  };

  const handleImagesModalClose = () => {
    setImagesModalOpen(false);
    setSelectedMenuEvent(null);
  };

  const handleTreesModalClose = () => {
    setTreesModalOpen(false);
    setSelectedMenuEvent(null);
  };

  const handleMessagesModalClose = () => {
    setMessagesModalOpen(false);
    setSelectedMenuEvent(null);
  };

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false);
    setSelectedItem(null);
  };

  return {
    // State
    eventModalOpen,
    eventModalMode,
    selectedEvent,
    openDeleteModal,
    selectedItem,
    imagesModalOpen,
    treesModalOpen,
    messagesModalOpen,
    menuAnchorEl,
    selectedMenuEvent,
    
    // Actions
    handleAddModalOpen,
    handleEditModalOpen,
    handleEventModalClose,
    handleDeleteEvent,
    handleDeleteModalClose,
    handleMenuOpen,
    handleMenuClose,
    handleImagesModalOpen,
    handleTreesModalOpen,
    handleMessagesModalOpen,
    handleImagesModalClose,
    handleTreesModalClose,
    handleMessagesModalClose,
  };
};