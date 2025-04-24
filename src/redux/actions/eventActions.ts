import ApiClient from "../../api/apiClient/apiClient";
import eventActionTypes from "../actionTypes/eventsActionType";
import { Event } from "../../types/event";
import { PaginatedResponse } from "../../types/pagination";
import { toast } from "react-toastify";

export const getEvents = (offset: number, limit: number, filters?: any[]) => {
  const apiClient = new ApiClient();
  return (dispatch: any) => {
    dispatch({
      type: eventActionTypes.GET_EVENTS_REQUESTED,
    });
    apiClient.getEvents(offset, limit, filters).then(
      (value: PaginatedResponse<Event>) => {
        console.log("Response in action: ", value);
        for (let i = 0; i < value.results.length; i++) {
          if (value.results[i]?.id) {
            value.results[i].key = value.results[i].id;
          }
        }
        dispatch({
          type: eventActionTypes.GET_EVENTS_SUCCEEDED,
          payload: value,
        });
      },
      (error: any) => {
        console.log(error);
        dispatch({
          type: eventActionTypes.GET_EVENTS_FAILED,
          payload: error,
        });
      }
    );
  };
};

/*export const deleteEvent = (data: Event) => {
  const apiClient = new ApiClient();
  return (dispatch: any) => {
    dispatch({
      type: eventActionTypes.DELETE_EVENTS_REQUESTED,
    });
    apiClient.deleteEvent(data).then(
      (id: number) => {
        toast.success("Event deleted successfully");
        dispatch({
          type: eventActionTypes.DELETE_EVENTS_SUCCEEDED,
          payload: id,
        });
      },
      (error: any) => {
        console.error(error);
        toast.error("Failed to delete Event");
        dispatch({
          type: eventActionTypes.DELETE_EVENTS_FAILED,
        });
      }
    );
  };
}; */


/*export const updateEvent = (data: Event)=>{
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: eventActionTypes.UPDATE_EVENTS_REQUESTED,
        });
         apiClient.updateEvent(data).then(
            (value: Event) => {
                toast.success("Event updated successfully");
                dispatch({
                    type: eventActionTypes.UPDATE_EVENTS_SUCCEEDED,
                    payload: value,
                   
                });
                
            },
            (error: any) => {
                toast.success("Failed to update Event");
                dispatch({
                    type: eventActionTypes.UPDATE_EVENTS_FAILED,
                    payload: error
                });
                
            }
        )
    };
}*/