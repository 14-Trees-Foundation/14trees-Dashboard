export interface EventImage {
  id: number;
  event_id: number;
  image_url: string;
  sequence: number;
  created_at: string;
  updated_at: string;
}

export interface EventImageCreationAttributes {
  event_id: number;
  image_url: string;
  sequence?: number;
}

export interface ImageSequenceUpdate {
  id: number;
  sequence: number;
}