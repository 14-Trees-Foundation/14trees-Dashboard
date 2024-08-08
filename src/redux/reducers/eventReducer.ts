import { UnknownAction } from "redux";
import { Event, EventsDataState } from "../../types/event";
import eventActionTypes from "../actionTypes/eventsActionType";
import { PaginatedResponse } from "../../types/pagination";

export const eventsDataReducer = (
  state = { totalEvents: 0, Events: {} },
  action: UnknownAction
): EventsDataState => {
  switch (action.type) {
    case eventActionTypes.GET_EVENTS_SUCCEEDED:
      if (action.payload) {
        let eventDataState: EventsDataState = {
          totalEvents: state.totalEvents,
          Events: { ...state.Events },
        };
        let payload = action.payload as PaginatedResponse<Event>;
        console.log(payload);
        if (eventDataState.totalEvents != payload.total) {
          eventDataState.Events = {};
        }
        eventDataState.totalEvents = payload.total;
        let events = payload.results;
        for (let i = 0; i < events.length; i++) {
          if (events[i]?.id) {
            events[i].key = events[i].id;
            eventDataState.Events[events[i].id] = events[i];
          }
        }
        const nextState: EventsDataState = eventDataState;
        return nextState;
      }
      return state;

    case eventActionTypes.DELETE_EVENTS_SUCCEEDED:
      if (action.payload) {
        const nextState = {
          totalEvents: state.totalEvents,
          Events: { ...state.Events },
        } as EventsDataState;
        Reflect.deleteProperty(nextState.Events, action.payload as number);
        nextState.totalEvents -= 1;
        return nextState;
      }
      return state;
    
      case eventActionTypes.UPDATE_EVENTS_SUCCEEDED:
            if (action.payload) {
                const nextState = {totalEvents: state.totalEvents, Events: { ...state.Events }} as EventsDataState;
                let payload = action.payload as Event
                payload.key = payload.id
                nextState.Events[payload.id] = payload;
                return nextState;
            }
            return state;

    default:
      return state;
  }
};
