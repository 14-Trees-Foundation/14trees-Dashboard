import { toast } from "react-toastify";
import ApiClient from "../../api/apiClient/apiClient";
import visituserGroupActionTypes from "../actionTypes/visitUserActionTypes";
import { BulkVisitUsersMappingResponse} from "../../types/visits"
import VisitUsersActionTypes from "../actionTypes/visitUserActionTypes";
import { PaginatedResponse } from "../../types/pagination";
import { User } from "../../types/user";

export const getVisitUsers = (visitId: number, offset: number, limit: number) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: VisitUsersActionTypes.GET_VISIT_USERS_REQUESTED,
        });
        apiClient.getVisitUsers(visitId, offset, limit).then(
            (value: PaginatedResponse<User>) => {
                toast.success("Users fetched successfully");
                for (let i = 0; i < value.results.length; i++) {
                    if (value.results[i]?.id) {
                        value.results[i].key = value.results[i].id
                    }
                }
                dispatch({
                    type: VisitUsersActionTypes.GET_VISIT_USERS_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                toast.error(error.message);
                dispatch({
                    type: VisitUsersActionTypes.GET_VISIT_USERS_FAILED,
                    payload: error
                });
            }
        )
    }
};

export const createVisitUsersBulk = (visitId: number, file: Blob) => {
  const apiClient = new ApiClient()
  return (dispatch: any) => {
      dispatch({
          type: visituserGroupActionTypes.CREATE_VISIT_BULK_USERS_REQUESTED,
      });
      apiClient.bulkCreateVisitUsersMapping(visitId, file).then(
          (value: BulkVisitUsersMappingResponse) => {
              dispatch({
                  type: visituserGroupActionTypes.CREATE_VISIT_BULK_USERS_SUCCEEDED,
                  payload: {
                      visit_id: visitId,
                      data: value
                  },
              });
              toast.success(`Successfully uploaded data!`)
          },
          (error: any) => {
              console.log(error)
              dispatch({
                  type: visituserGroupActionTypes.CREATE_VISIT_BULK_USERS_FAILED,
                  payload: error
              });
              toast.error(`Failed to upload data!`)
          }
      )
  }
};


export const createVisitUser = (data: any) => {
  const apiClient = new ApiClient()
  return (dispatch: any) => {
      dispatch({
          type: visituserGroupActionTypes.CREATE_VISIT_USER_REQUESTED,
      });
      apiClient.addUserToVisit(data).then(
          () => {
              dispatch({
                  type: visituserGroupActionTypes.CREATE_VISIT_USER_SUCCEEDED,
              });
              toast.success(`Successfully added user to visit!`)
          },
          (error: any) => {
              console.log(error)
              dispatch({
                  type: visituserGroupActionTypes.CREATE_VISIT_USER__FAILED,
                  payload: error.message
              });
              toast.error(`Failed to add user to visit!`)
          }
      )
  }
};

export const removeVisitUsers = (visitId: number, userIds: number[]) => {
  const apiClient = new ApiClient()
  return (dispatch: any) => {
      dispatch({
          type: visituserGroupActionTypes.DELETE_VISIT_USER_REQUESTED,
      });
      apiClient.removeVisitUsers(visitId, userIds).then(
          (value: any) => {
              dispatch({
                  type: visituserGroupActionTypes.DELETE_VISIT_USER_SUCCEEDED,
                  payload: {
                      visitId: visitId,
                      userIds: userIds
                  },
              });
              toast.success(`Successfully removed users from visit!`)
          },
          (error: any) => {
              console.log(error)
              dispatch({
                  type: visituserGroupActionTypes.DELETE_VISIT_USER_FAILED,
                  payload: error
              });
              toast.error(`Failed to remove users from visit!`)
          }
      )
  }
};
