import ApiClient from "../../api/apiClient/apiClient";
import groupActionTypes from "../actionTypes/groupActionTypes";
import { Group } from "../../types/Group";
import { PaginatedResponse } from "../../types/pagination";
import { toast } from "react-toastify";

export const getGroups = (offset: number, limit: number, filters?: any[]) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: groupActionTypes.GET_GROUPS_REQUESTED,
        });
        apiClient.getGroups(offset, limit, filters).then(
            (value: PaginatedResponse<Group>) => {
                for (let i = 0; i < value.results.length; i++) {
                    if (value.results[i]?.id) {
                        value.results[i].key = value.results[i].id
                    }
                }
                dispatch({
                    type: groupActionTypes.GET_GROUPS_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.log(error)
                dispatch({
                    type: groupActionTypes.GET_GROUPS_FAILED,
                    payload: error
                });
                toast.error(`Failed to fetch groups!`)
            }
        )
    }
};

export const createGroup = (record: Group, logo?: File) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: groupActionTypes.CREATE_GROUP_REQUESTED,
        });
        apiClient.createGroup(record, logo).then(
            (value: Group) => {
                dispatch({
                    type: groupActionTypes.CREATE_GROUP_SUCCEEDED,
                    payload: value,
                });
                toast.success(`Successfully created group!`)
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: groupActionTypes.CREATE_GROUP_FAILED,
                });
                toast.error(`Failed to create group!`)
            }
        )
    };
};

export const updateGroup = (record: Group, logo?: File) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: groupActionTypes.UPDATE_GROUP_REQUESTED,
        });
        apiClient.updateGroup(record, logo).then(
            (value: Group) => {
                dispatch({
                    type: groupActionTypes.UPDATE_GROUP_SUCCEEDED,
                    payload: value,
                });
                toast.success(`Successfully updated group!`)
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: groupActionTypes.UPDATE_GROUP_FAILED,
                });
                toast.error(`Failed to update group!`)
            }
        )
    };
};


export const deleteGroup = (record: Group) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: groupActionTypes.DELETE_GROUP_FAILED,
        });
        apiClient.deleteGroup(record).then(
            (id: number) => {
                dispatch({
                    type: groupActionTypes.DELETE_GROUP_SUCCEEDED,
                    payload: id,
                });
                toast.success(`Successfully deleted group!`)
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: groupActionTypes.DELETE_GROUP_FAILED,
                });
                toast.error(`Failed to delete group!`)
            }
        )
    };
};

export const searchGroups = (offset: number, limit: number, searchStr: string) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: groupActionTypes.SEARCH_GROUPS_REQUESTED,
        });
        apiClient.searchGroups(offset, limit, searchStr).then(
            (value: PaginatedResponse<Group>) => {
                dispatch({
                    type: groupActionTypes.SEARCH_GROUPS_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.log(error)
                dispatch({
                    type: groupActionTypes.SEARCH_GROUPS_FAILED,
                    payload: error
                });
            }
        )
    }
};