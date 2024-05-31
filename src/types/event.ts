export type Event = {
    key: string,
    _id: string,
    name: string,
    Eventid: string,
    phone: number,
    email: string,
    dob: Date,
    date_added: Date,
    pin : number,
    org : string
};

export type EventPaginationResponse = {
    total: number,
    result: Event[]
}

export type EventsDataState = {
    totalEvents: number,
    Events: Record<string, Event>
}
export type SearchEventsDataState = Record<string,Event>;