import ApiClient from "../../api/apiClient/apiClient";
import organizationActionTypes from "../actionTypes/groupActionTypes";
import { Group } from "../../types/Group";
import { PaginatedResponse } from "../../types/pagination";

export const getGroups = (offset: number, limit: number, filters?: any[]) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: organizationActionTypes.GET_GROUPS_REQUESTED,
        });
        apiClient.getGroups(offset, limit, filters).then(
            (value: PaginatedResponse<Group>) => {
                for (let i = 0; i < value.results.length; i++) {
                    if (value.results[i]?.id) {
                        value.results[i].key = value.results[i].id
                    }
                }
                dispatch({
                    type: organizationActionTypes.GET_GROUPS_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.log(error)
                dispatch({
                    type: organizationActionTypes.GET_GROUPS_FAILED,
                    payload: error
                });
            }
        )
    }
};

export const createGroup = (record: Group) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: organizationActionTypes.CREATE_GROUP_REQUESTED,
        });
        apiClient.createGroup(record).then(
            (value: Group) => {
                dispatch({
                    type: organizationActionTypes.CREATE_GROUP_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: organizationActionTypes.CREATE_GROUP_FAILED,
                });
            }
        )
    };
};

export const updateGroup = (record: Group) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: organizationActionTypes.UPDATE_GROUP_REQUESTED,
        });
        apiClient.updateGroup(record).then(
            (value: Group) => {
                dispatch({
                    type: organizationActionTypes.UPDATE_GROUP_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: organizationActionTypes.UPDATE_GROUP_FAILED,
                });
            }
        )
    };
};


export const deleteGroup = (record: Group) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: organizationActionTypes.DELETE_GROUP_FAILED,
        });
        apiClient.deleteGroup(record).then(
            (id: number) => {
                dispatch({
                    type: organizationActionTypes.DELETE_GROUP_SUCCEEDED,
                    payload: id,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: organizationActionTypes.DELETE_GROUP_FAILED,
                });
            }
        )
    };
};