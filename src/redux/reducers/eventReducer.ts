import { UnknownAction } from "redux";
import { Event, EventsDataState } from "../../types/event";
import eventActionTypes from "../actionTypes/eventsActionType";
import { PaginatedResponse } from "../../types/pagination";

export const eventsDataReducer = (
  state = { totalEvents: 0, Events: {}, loading: false, paginationMapping: {} },
  action: UnknownAction
): EventsDataState => {
  switch (action.type) {
    case eventActionTypes.GET_EVENTS_REQUESTED:
      return { 
        ...state, 
        loading: true 
      };

    case eventActionTypes.GET_EVENTS_SUCCEEDED:
      if (action.payload) {
        let eventsDataState: EventsDataState = { 
          loading: false,
          totalEvents: state.totalEvents, 
          Events: { ...state.Events }, 
          paginationMapping: { ...state.paginationMapping }
        };
        
        let payload = action.payload as PaginatedResponse<Event>;
        const offset = payload.offset;

        // Reset data if it's the first page (offset 0)
        if (payload.offset === 0) { 
          eventsDataState.Events = {};
          eventsDataState.paginationMapping = {};
        }

        let events = payload.results;
        for (let i = 0; i < events.length; i++) {
          if (events[i]?.id) {
            events[i].key = events[i].id;
            eventsDataState.Events[events[i].id] = events[i];
            eventsDataState.paginationMapping[offset + i] = events[i].id;
          }
        }

        return { 
          ...eventsDataState, 
          totalEvents: payload.total 
        };
      }
      return state;

    case eventActionTypes.GET_EVENTS_FAILED:
      return { 
        ...state, 
        loading: false 
      };

    case eventActionTypes.UPDATE_EVENTS_SUCCEEDED:
      if (action.payload) {
        let nextState: EventsDataState = { 
          ...state,
          Events: { ...state.Events }
        };

        let payload = action.payload as Event;
        payload.key = payload.id;
        nextState.Events[payload.id] = payload;
        return nextState;
      }
      return state;

    case eventActionTypes.DELETE_EVENTS_SUCCEEDED:
      if (action.payload) {
        let nextState: EventsDataState = { 
          ...state,
          Events: { ...state.Events }
        };

        Reflect.deleteProperty(nextState.Events, action.payload as number);
        nextState.totalEvents -= 1;
        return nextState;
      }
      return state;

    default:
      return state;
  }
};