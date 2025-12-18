import axios, { AxiosInstance } from 'axios';
import { Event, EventMessage, EventMessageCreationAttributes, MessageSequenceUpdate } from '../../types/event';
import { EventImage, ImageSequenceUpdate } from '../../types/eventImage';
import { Tree } from '../../types/tree';
import { PaginatedResponse } from '../../types/pagination';

class EventsApiClient {
  private api: AxiosInstance;

  constructor() {
    const baseURL = import.meta.env.VITE_APP_BASE_URL;
    const userId = localStorage.getItem("userId");
    
    this.api = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-user-id': userId ? userId : '',
      },
    });
  }

  // ===== BASIC EVENT CRUD =====

  async getEvents(offset: number = 0, limit: number = 10, filters: any[] = []): Promise<PaginatedResponse<Event>> {
    const url = `/events/get?offset=${offset}&limit=${limit}`;
    try {
      const response = await this.api.post<PaginatedResponse<Event>>(url, { filters: filters });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to fetch events");
    }
  }

  async createEvent(eventData: Partial<Event>, images?: File[], eventPoster?: File | null, landingImage?: File | null, landingImageMobile?: File | null): Promise<Event> {
    try {
      // Convert tags string to array format expected by backend
      let tagsArray: string[] = [];
      if (eventData.tags && typeof eventData.tags === 'string') {
        // Split by comma and trim whitespace
        tagsArray = (eventData.tags as any).split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
      } else if (Array.isArray(eventData.tags)) {
        tagsArray = eventData.tags;
      }

      // Use provided link or generate a unique link for the event (as expected by repository queries)
      const link = eventData.link || Math.random().toString(36).slice(2, 10);

      // If images or eventPoster are provided, use multipart form data
      if ((images && images.length > 0) || eventPoster) {
        const formData = new FormData();
        
        // Add event data fields - ensure all required fields are present
        formData.append('name', eventData.name || '');
        formData.append('type', (eventData.type || '').toString());
        formData.append('event_date', eventData.event_date ? eventData.event_date.toString() : '');
        // Keep existing event_location (onsite/offsite) as-is
        formData.append('event_location', eventData.event_location || 'onsite');
        // Optional detailed location picked via map
        if ((eventData as any).location) {
          formData.append('location', JSON.stringify((eventData as any).location));
        }
        formData.append('link', link);
        formData.append('assigned_by', (eventData.assigned_by || 1).toString());
        
        // Add optional fields only if they have values
        if (eventData.description) formData.append('description', eventData.description);
        if (eventData.message) formData.append('message', eventData.message);
        if ((eventData as any).theme_color) formData.append('theme_color', (eventData as any).theme_color);
        if (eventData.site_id) {
          formData.append('site_id', eventData.site_id.toString());
        }
        
        // Always append tags as JSON string (may be empty array)
        formData.append('tags', JSON.stringify(tagsArray));
        
        // Add images if present
        if (images && images.length > 0) {
          images.forEach((image) => {
            formData.append('images', image);
          });
        }

        // Add event poster if present
        if (eventPoster) {
          formData.append('event_poster', eventPoster);
        }

        // Add landing images if present
        if (landingImage) {
          formData.append('landing_image', landingImage);
        }
        if (landingImageMobile) {
          formData.append('landing_image_mobile', landingImageMobile);
        }

        // Multipart submission prepared with form data, images and optional poster

        // Don't set Content-Type header - let axios set it automatically with boundary
        const response = await this.api.post<Event>('/events/', formData);
        return response.data;
      } else {
        // No images, use regular JSON payload
        const payload: any = {
          name: eventData.name,
          type: parseInt(eventData.type as string), // Ensure type is number
          event_date: eventData.event_date,
          event_location: eventData.event_location || 'onsite',
          // Include optional detailed location object if present
          ...( (eventData as any).location ? { location: (eventData as any).location } : {} ),
          description: eventData.description,
          tags: tagsArray,
          message: eventData.message,
          theme_color: (eventData as any).theme_color,
          link: link,
          assigned_by: eventData.assigned_by || 1,
          site_id: eventData.site_id || null,
        };

        // Remove undefined values to avoid backend issues
        Object.keys(payload).forEach(key => {
          if (payload[key] === undefined) {
            delete payload[key];
          }
        });

        // JSON submission (no images/poster in request body)

        const response = await this.api.post<Event>('/events/', payload);
        return response.data;
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to create event");
    }
  }

  async updateEvent(eventData: any): Promise<Event> {
    try {
  // Check if we have mixed image data (URLs and File objects)
      const images = eventData.images || [];
      const memories = eventData.memories || [];
      const relevantImages = eventData.type === '2' ? memories : images;
      
      // Separate existing images (URLs) from new uploads (File objects)
      const existingImages: string[] = [];
      const newFiles: File[] = [];
      
      relevantImages.forEach((item: any) => {
        if (typeof item === 'string') {
          existingImages.push(item); // Existing image URL
        } else if (item instanceof File) {
          newFiles.push(item); // New file upload
        }
      });

      // Check if there's a new event poster File as well
      const hasNewPoster = eventData.event_poster && eventData.event_poster instanceof File;
      // Check if there's a new landing image File as well
      const hasNewLanding = eventData.landing_image && eventData.landing_image instanceof File;
      // If we have new files or a new poster file, use multipart form data
      // Check if there's a new mobile landing image File as well
      const hasNewLandingMobile = eventData.landing_image_mobile && eventData.landing_image_mobile instanceof File;

      if (newFiles.length > 0 || hasNewPoster || hasNewLanding || hasNewLandingMobile) {
        const formData = new FormData();
        
        // Add event data fields
        if (eventData.name) formData.append('name', eventData.name);
        if (eventData.type) formData.append('type', eventData.type.toString());
        if (eventData.event_date) formData.append('event_date', eventData.event_date);
        if (eventData.event_location) formData.append('event_location', eventData.event_location);
        if (eventData.assigned_by) formData.append('assigned_by', eventData.assigned_by.toString());
        if (eventData.site_id) formData.append('site_id', eventData.site_id.toString());
        if (eventData.description) formData.append('description', eventData.description);
        if (eventData.message) formData.append('message', eventData.message);
        if (eventData.link) formData.append('link', eventData.link);
        
        // Normalize tags into array and always append (may be empty)
        let updateTagsArray: string[] = [];
        if (eventData.tags) {
          if (Array.isArray(eventData.tags)) {
            updateTagsArray = eventData.tags;
          } else if (typeof eventData.tags === 'string') {
            const raw = (eventData.tags as string).split(',');
            for (let i = 0; i < raw.length; i++) {
              const t = raw[i];
              if (t && t.trim().length > 0) updateTagsArray.push(t.trim());
            }
          }
        }
        formData.append('tags', JSON.stringify(updateTagsArray));
        
        // Add existing images as JSON string
        if (existingImages.length > 0) {
          formData.append('existingImages', JSON.stringify(existingImages));
        }
        
        // Add event poster if a new File object is provided (single file)
        if (eventData.event_poster && eventData.event_poster instanceof File) {
          formData.append('event_poster', eventData.event_poster);
        }

        // Add landing image if a new File object is provided
        if (eventData.landing_image && eventData.landing_image instanceof File) {
          formData.append('landing_image', eventData.landing_image);
        }

        // Add mobile landing image if a new File object is provided
        if (eventData.landing_image_mobile && eventData.landing_image_mobile instanceof File) {
          formData.append('landing_image_mobile', eventData.landing_image_mobile);
        }

        // Add new image files
        newFiles.forEach((file) => {
          formData.append('images', file);
        });

        // Multipart update with existing image references and newly uploaded files

        const response = await this.api.put<Event>(`/events/${eventData.id}`, formData);
        return response.data;
      } else {
        // No new files, use regular JSON payload
        const payload = {
          ...eventData,
          images: eventData.type === '2' ? null : existingImages.length > 0 ? existingImages : null,
          memories: eventData.type === '2' ? existingImages.length > 0 ? existingImages : null : null,
        };
        // Ensure payload.tags is always an array
        let payloadTagsArray: string[] = [];
        if (payload.tags) {
          if (Array.isArray(payload.tags)) {
            payloadTagsArray = payload.tags;
          } else if (typeof payload.tags === 'string') {
            const raw = (payload.tags as string).split(',');
            for (let i = 0; i < raw.length; i++) {
              const t = raw[i];
              if (t && t.trim().length > 0) payloadTagsArray.push(t.trim());
            }
          }
        }
        payload.tags = payloadTagsArray;

        // JSON update (no new files)

        const response = await this.api.put<Event>(`/events/${eventData.id}`, payload);
        return response.data;
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to update event");
    }
  }

  async deleteEvent(eventId: number): Promise<void> {
    try {
      await this.api.delete(`/events/${eventId}`);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to delete event");
    }
  }

  // ===== TREE ASSOCIATION METHODS =====

  async getEventTrees(eventId: number): Promise<Tree[]> {
    try {
      const response = await this.api.get<Tree[]>(`/events/${eventId}/trees`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to fetch event trees");
    }
  }

  async associateTreesToEvent(eventId: number, treeIds: number[]): Promise<void> {
    try {
      await this.api.post(`/events/${eventId}/trees`, { treeIds });
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to associate trees to event");
    }
  }

  async dissociateTreesFromEvent(eventId: number, treeIds: number[]): Promise<void> {
    try {
      await this.api.delete(`/events/${eventId}/trees`, { data: { treeIds } });
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to dissociate trees from event");
    }
  }

  // ===== IMAGE ASSOCIATION METHODS =====

  async getEventImages(eventId: number): Promise<EventImage[]> {
    try {
      const response = await this.api.get<EventImage[]>(`/events/${eventId}/images`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to fetch event images");
    }
  }

  async uploadEventImages(eventId: number, images: File[]): Promise<EventImage[]> {
    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append('images', image);
      });

      const response = await this.api.post<EventImage[]>(`/events/${eventId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to upload event images");
    }
  }

  async removeEventImages(eventId: number, imageIds: number[]): Promise<void> {
    try {
      await this.api.delete(`/events/${eventId}/images`, { data: { imageIds } });
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to remove event images");
    }
  }

  async reorderEventImages(eventId: number, imageSequences: ImageSequenceUpdate[]): Promise<void> {
    try {
      await this.api.put(`/events/${eventId}/images/reorder`, { imageSequences });
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to reorder event images");
    }
  }

  // ===== MESSAGE METHODS =====

  async getEventMessages(event_link: string): Promise<EventMessage[]> {
    try {
      const response = await this.api.get<EventMessage[]>(`/events/messages/${event_link}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to fetch event messages");
    }
  }

  async createEventMessage(eventId: number, message: string, userName?: string, userId?: number): Promise<EventMessage> {
    try {
      const payload = {
        message,
        user_name: userName,
        userId: userId || null
      };
      const response = await this.api.post<EventMessage>(`/events/${eventId}/messages`, payload);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to create event message");
    }
  }

  async updateEventMessage(messageId: number, message: string): Promise<EventMessage> {
    try {
      const payload = { message };
      const response = await this.api.put<EventMessage>(`/events/messages/${messageId}`, payload);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to update event message");
    }
  }

  async deleteEventMessage(messageId: number): Promise<void> {
    try {
      await this.api.delete(`/events/messages/${messageId}`);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to delete event message");
    }
  }

  async reorderEventMessages(eventId: number, messageSequences: MessageSequenceUpdate[]): Promise<void> {
    try {
      await this.api.put(`/events/${eventId}/messages/reorder`, { messageSequences });
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to reorder event messages");
    }
  }

  // ===== UTILITY METHODS =====

  async getUsers(): Promise<any[]> {
    try {
      // This method would be used for messenger selection
      // Assuming there's a users endpoint available
      const response = await this.api.get<any[]>('/users');
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to fetch users");
    }
  }
}

export default EventsApiClient;