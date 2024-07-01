import ApiClient from "../../api/apiClient/apiClient";
import eventActionTypes from "../actionTypes/eventsActionType";
import { Event } from "../../types/event";
import { PaginatedResponse } from "../../types/pagination";


export const getEvents = (offset: number, limit: number , filters?: any[]) => {
  const apiClient = new ApiClient()
  return (dispatch: any) => {
      dispatch({
          type: eventActionTypes.GET_EVENTS_REQUESTED,
      });
      apiClient.getEvents(offset, limit , filters).then(
          (value: PaginatedResponse<Event>) => {
              console.log("Response in action: ", value)
              for (let i = 0; i < value.results.length; i++) {
                  if (value.results[i]?.id) {
                      value.results[i].key = value.results[i].id
                  }
              }
              dispatch({
                  type: eventActionTypes.GET_EVENTS_SUCCEEDED,
                  payload: value,
              });
          },
          (error: any) => {
              console.log(error)
              dispatch({
                  type: eventActionTypes.GET_EVENTS_FAILED,
                  payload: error
              });
          }
      )
  }
};
