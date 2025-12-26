
type EventLocation = 'onsite' | 'offsite'
type EventLocationPoint = { lat: number; lng: number; address?: string }
type EventThemeColor = 'yellow' | 'red' | 'green' | 'blue' | 'pink'

export type Event = {
  id: number,
  key: number;
  assigned_by: number,
  site_id: number,
  site_name: string,
  name: string,
  type: string,
  description?: string,
  tags?: string[],
  event_date: Date,
  memories?: string[],
  images: string[] | null,
  message: string | null,
  event_location: EventLocation,
  theme_color?: EventThemeColor,
  event_poster?: string | null,
  landing_image_s3_path?: string | null,
  landing_image_mobile_s3_path?: string | null,
  location?: EventLocationPoint | null,
  link: string,
  default_tree_view_mode?: 'illustrations' | 'profile',
  show_blessings?: boolean,
  total_views?: number,
  unique_views?: number,
};

export type EventMessage = {
  id: number;
  key: number;
  user_id: number | null;
  user_name: string;
  event_id: number;
  message: string;
  sequence: number;
  created_at: string;
  updated_at: string;
};

export interface EventMessageCreationAttributes {
  event_id: number;
  message: string;
  user_id: number; // Required - messenger must be specified
  sequence?: number; // Optional - will be auto-assigned if not provided
}

export interface MessageSequenceUpdate {
  id: number;
  sequence: number;
}

export type EventPaginationResponse = {
  total: number,
  result: Event[]
}

export type EventsDataState = {
  loading: boolean,
  totalEvents: number,
  Events: Record<string, Event>
  paginationMapping: Record<number, number> 
}