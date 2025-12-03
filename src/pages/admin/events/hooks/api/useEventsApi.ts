import { useAppDispatch } from "../../../../../redux/store/hooks";
import * as eventActionCreators from "../../../../../redux/actions/eventActions";
import { bindActionCreators } from "redux";
import { GridFilterItem } from "@mui/x-data-grid";
import { Event } from "../../../../../types/event";
import ApiClient from "../../../../../api/apiClient/apiClient";
import { toast } from "react-toastify";

export const useEventsApi = () => {
  const dispatch = useAppDispatch();
  const { getEvents } = bindActionCreators(eventActionCreators, dispatch);

  const getEventsData = async (page: number, pageSize: number, filters: Record<string, GridFilterItem>) => {
    let filtersData = Object.values(filters);
    getEvents(page * pageSize, pageSize, filtersData);
  };

  const getAllEventsData = async (filters: Record<string, GridFilterItem>) => {
    const apiClient = new ApiClient();
    try {
      const eventsResp = await apiClient.events.getEvents(0, -1, Object.values(filters));
      return eventsResp.results;
    } catch (error: any) {
      toast.error(error.message);
      return [];
    }
  };

  const createEvent = async (formData: any) => {
    const apiClient = new ApiClient();
    
    // Extract images/memories from form data (they come as File[] from the form)
    const images = formData.images || [];
    const memories = formData.memories || [];
    const filesToUpload = formData.type === '2' ? memories : images;
    
    // Extract event poster if present
    const eventPoster = formData.event_poster;
    
    // Prepare files for create: images/memories and optional poster
    
    // Create a clean event data object without the File arrays
    const eventDataForCreation = {
      ...formData,
      images: null, // Clear images array for event creation (files will be passed separately)
      memories: undefined, // Clear memories array for event creation
      event_poster: undefined // Clear event_poster for event creation (will be passed separately)
    };
    
    // Create the event with images - API client will handle multipart form data
    const newEvent = await apiClient.events.createEvent(eventDataForCreation, filesToUpload, eventPoster);
    
    toast.success('Event created successfully!');
    return newEvent;
  };

  const updateEvent = async (formData: Event) => {
    const apiClient = new ApiClient();
    const updatedEvent = await apiClient.events.updateEvent(formData);
    toast.success('Event updated successfully!');
    return updatedEvent;
  };

  return {
    // API Actions
    getEventsData,
    getAllEventsData,
    createEvent,
    updateEvent,
  };
};