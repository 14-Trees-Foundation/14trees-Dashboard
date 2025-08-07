import ApiClient from '../../../../api/apiClient/apiClient';
import { ImageApiMethods, ImageItem, ImageSequenceUpdate } from '../types';
import { EventImage } from '../../../../types/eventImage';

/**
 * Adapter to convert EventImage API to generic ImageManager API
 */
export const createEventImageApiMethods = (): ImageApiMethods => {
  const apiClient = new ApiClient();

  return {
    getImages: async (eventId: number): Promise<ImageItem[]> => {
      const eventImages: EventImage[] = await apiClient.events.getEventImages(eventId);
      
      // Convert EventImage to ImageItem
      return eventImages.map(eventImage => ({
        id: eventImage.id,
        entity_id: eventImage.event_id,
        image_url: eventImage.image_url,
        sequence: eventImage.sequence,
        created_at: eventImage.created_at,
        updated_at: eventImage.updated_at,
      }));
    },

    uploadImages: async (eventId: number, files: File[]): Promise<ImageItem[]> => {
      const uploadedImages: EventImage[] = await apiClient.events.uploadEventImages(eventId, files);
      
      // Convert EventImage to ImageItem
      return uploadedImages.map(eventImage => ({
        id: eventImage.id,
        entity_id: eventImage.event_id,
        image_url: eventImage.image_url,
        sequence: eventImage.sequence,
        created_at: eventImage.created_at,
        updated_at: eventImage.updated_at,
      }));
    },

    removeImages: async (eventId: number, imageIds: number[]): Promise<void> => {
      await apiClient.events.removeEventImages(eventId, imageIds);
    },

    reorderImages: async (eventId: number, sequences: ImageSequenceUpdate[]): Promise<void> => {
      await apiClient.events.reorderEventImages(eventId, sequences);
    },
  };
};