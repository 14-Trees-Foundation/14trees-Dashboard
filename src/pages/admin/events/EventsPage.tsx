import { toast, ToastContainer } from "react-toastify";
import { Event } from "../../../types/event";
import { useEventsTable } from "./components/EventsTable/useEventsTable";
import { useEventsApi } from "./hooks/api/useEventsApi";
import { useEventsModals } from "./hooks/modals/useEventsModals";

import { EventHeader } from "./components/EventHeader";
import { EventsTable } from "./components/EventsTable/EventsTable";
import { EventActionMenu } from "./components/EventsTable/EventActionMenu";
import { DeleteEventDialog } from "./components/DeleteEventDialog";
import EventMessageAssociation from "./components/EventMessageAssociation/EventMessageAssociation";
import EventTreeAssociation from "./components/EventTreeAssociation/EventTreeAssociation";
import EventImageAssociation from "./components/EventImageAssociation/EventImageAssociation";
import AddUpdateEventModal from "./components/AddUpdateEventModal/AddUpdateEventModal";

export const EventsPage = () => {
  // Custom hooks for state management
  const tableHook = useEventsTable();
  const apiHook = useEventsApi();
  const modalsHook = useEventsModals();

  // Event CRUD handlers
  const handleEventSubmit = async (formData: any) => {
    try {
      if (modalsHook.eventModalMode === 'add') {
        console.log('Creating event:', formData);
        await apiHook.createEvent(formData);
        console.log('Event created successfully');
      } else {
        console.log('Updating event:', formData);
        await apiHook.updateEvent(formData);
        console.log('Event updated successfully');
      }
      
      // Refresh data after successful operation
      await apiHook.getEventsData(tableHook.page, tableHook.pageSize, tableHook.filters);
      modalsHook.handleEventModalClose();
    } catch (error: any) {
      console.error(`Error ${modalsHook.eventModalMode === 'add' ? 'creating' : 'updating'} event:`, error);
      toast.error(`Failed to ${modalsHook.eventModalMode === 'add' ? 'create' : 'update'} event: ${error.message}`);
      throw error; // Re-throw to let the modal handle loading states
    }
  };



  // Delete confirmation
  const handleDeleteConfirm = () => {
    console.log("Deleting item...", modalsHook.selectedItem);
    // TODO: Implement actual delete functionality
    // if (modalsHook.selectedItem !== null) {
    //   deleteEvent(modalsHook.selectedItem);
    // }
    modalsHook.handleDeleteModalClose(); // Close delete modal
  };

  return (
    <>
      <ToastContainer />
      
      <EventHeader onAddEvent={modalsHook.handleAddModalOpen} />

      <EventsTable
        loading={tableHook.eventsData.loading}
        rows={tableHook.tableRows}
        totalRecords={tableHook.eventsData.totalEvents}
        page={tableHook.page}
        pageSize={tableHook.pageSize}
        filters={tableHook.filters}
        onPaginationChange={tableHook.handlePaginationChange}
        onDownload={() => apiHook.getAllEventsData(tableHook.filters)}
        onSetFilters={tableHook.handleSetFilters}
        onMenuOpen={modalsHook.handleMenuOpen}
      />

      <DeleteEventDialog
        open={modalsHook.openDeleteModal}
        event={modalsHook.selectedItem}
        onClose={modalsHook.handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
      />

      <AddUpdateEventModal
        open={modalsHook.eventModalOpen}
        handleClose={modalsHook.handleEventModalClose}
        mode={modalsHook.eventModalMode}
        existingEvent={modalsHook.selectedEvent}
        onSubmit={handleEventSubmit}
      />

      <EventActionMenu
        anchorEl={modalsHook.menuAnchorEl}
        selectedEvent={modalsHook.selectedMenuEvent}
        onClose={modalsHook.handleMenuClose}
        onEditEvent={modalsHook.handleEditModalOpen}
        onDeleteEvent={modalsHook.handleDeleteEvent}
        onImagesModal={modalsHook.handleImagesModalOpen}
        onTreesModal={modalsHook.handleTreesModalOpen}
        onMessagesModal={modalsHook.handleMessagesModalOpen}
      />

      {/* Images Association Modal */}
      <EventImageAssociation
        eventId={modalsHook.selectedMenuEvent?.id}
        eventName={modalsHook.selectedMenuEvent?.name}
        open={modalsHook.imagesModalOpen}
        onClose={modalsHook.handleImagesModalClose}
      />

      {/* Trees Association Modal */}
      <EventTreeAssociation
        eventId={modalsHook.selectedMenuEvent?.id}
        eventName={modalsHook.selectedMenuEvent?.name}
        open={modalsHook.treesModalOpen}
        onClose={modalsHook.handleTreesModalClose}
      />

      {/* Messages Association Modal */}
      <EventMessageAssociation
        eventId={modalsHook.selectedMenuEvent?.id}
        eventLink={modalsHook.selectedMenuEvent?.link}
        eventName={modalsHook.selectedMenuEvent?.name}
        open={modalsHook.messagesModalOpen}
        onClose={modalsHook.handleMessagesModalClose}
      />
    </>
  );
};
