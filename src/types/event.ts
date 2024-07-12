
type EventLocation = 'onsite' | 'offsite'

export type Event = {
    id: number,
    key: number;
    assigned_by: number,
    site_id: number,
    name: string,
      type: number,
    description?: string,
      tags?: string[],
    event_date: Date,
    memories?: string[],
    event_location: EventLocation
};

export type EventPaginationResponse = {
    total: number,
    result: Event[]
}

export type EventsDataState = {
    totalEvents: number,
    Events: Record<string, Event>
}