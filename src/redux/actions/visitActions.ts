import ApiClient from "../../api/apiClient/apiClient";
import { PaginatedResponse } from "../../types/pagination";
import { toast } from 'react-toastify';
import visitActionTypes from "../actionTypes/visitActionTypes";
import { Visit } from "../../types/visits";
             

export const getVisits = (offset: number, limit: number, filters?: any[]) => {
  const apiClient = new ApiClient()
  return (dispatch: any) => {
      dispatch({
          type: visitActionTypes.GET_VISITS_REQUESTED,
      });
      apiClient.getVisits(offset, limit, filters).then(
          (value: PaginatedResponse<Visit>) => {
              
              dispatch({
                  type: visitActionTypes.GET_VISITS_SUCCEEDED,
                  payload: value,
              });
          },
          (error: any) => {
              console.log(error)
              dispatch({
                  type: visitActionTypes.GET_VISITS_FAILED,
                  payload: error
              });
          }
      )
  }
};


export const createVisit = (record: Visit) => {
  const apiClient = new ApiClient();
  return (dispatch: any) => {
      dispatch({
          type: visitActionTypes.CREATE_VISIT_REQUESTED,
      });
      apiClient.createVisit(record).then(
          (value: Visit) => {
              toast.success('New Visit Added successfully')
              dispatch({
                  type: visitActionTypes.CREATE_VISIT_SUCCEEDED,
                  payload: value,
                 
              });
              console.log("Added new visit : ",value)
              return(value)
          },
          (error: any) => {
              console.error(error);
              toast.error('Failed to add new Site')
              dispatch({
                  type: visitActionTypes.CREATE_VISIT_FAILED,
              });
              return(error)
          }
      )
  };
};

export const updateVisit = (record: Visit) => {
  const apiClient = new ApiClient();
  return (dispatch: any) => {

      dispatch({
          type: visitActionTypes.UPDATE_VISIT_REQUESTED,
      });
       apiClient.updateVisit(record).then(
          (value: Visit) => {
              toast.success('Visit data Edited successfully')
              dispatch({
                  type: visitActionTypes.UPDATE_VISIT_SUCCEEDED,
                  payload: value,
                 
              });
              
          },
          (error: any) => {
              toast.error('Failed to edit visit data')
              dispatch({
                  type: visitActionTypes.UPDATE_VISIT_FAILED,
                  payload: error
              });
              
          }
      )
  };
};


export const deleteVisit = (record: Visit) => {
  const apiClient = new ApiClient();
  return (dispatch: any) => {
      
      dispatch({
          type: visitActionTypes.DELETE_VISIT_REQUESTED,
      });
      apiClient.deleteVisit(record).then(
          (id: number) => {
              toast.success('Visit deleted successfully')
              dispatch({
                  type: visitActionTypes.DELETE_VISIT_SUCCEEDED,
                  payload: id,
              });
          },
          (error: any) => {
              console.error(error);
              toast.error('Failed to delete Visit')
              dispatch({
                  type: visitActionTypes.DELETE_VISIT_FAILED,
              });
          }
      )
  };
};

