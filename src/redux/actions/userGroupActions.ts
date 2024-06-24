import ApiClient from "../../api/apiClient/apiClient";
import { BulkUserGroupMappingResponse } from "../../types/Group";
import userGroupActionTypes from "../actionTypes/userGroupsActionTypes";

export const bulkCreateUserGroupMapping = (groupId: number, file: Blob) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: userGroupActionTypes.CREATE_BULK_USER_GROUP_MAPPING_REQUESTED,
        });
        apiClient.bulkCreateUserGroupMapping(groupId, file).then(
            (value: BulkUserGroupMappingResponse) => {
                dispatch({
                    type: userGroupActionTypes.CREATE_BULK_USER_GROUP_MAPPING_SUCCEEDED,
                    payload: {
                        groupId: groupId,
                        data: value
                    },
                });
            },
            (error: any) => {
                console.log(error)
                dispatch({
                    type: userGroupActionTypes.CREATE_BULK_USER_GROUP_MAPPING_FAILED,
                    payload: error
                });
            }
        )
    }
};

export const createUserGroupMapping = (data: any) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: userGroupActionTypes.CREATE_USER_GROUP_MAPPING_REQUESTED,
        });
        apiClient.addUserToGroup(data).then(
            () => {
                dispatch({
                    type: userGroupActionTypes.CREATE_USER_GROUP_MAPPING_SUCCEEDED,
                });
            },
            (error: any) => {
                console.log(error)
                dispatch({
                    type: userGroupActionTypes.CREATE_USER_GROUP_MAPPING_FAILED,
                    payload: error.message
                });
            }
        )
    }
};

export const removeGroupUsers = (groupId: number, userIds: number[]) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: userGroupActionTypes.DELETE_USER_GROUP_MAPPING_REQUESTED,
        });
        apiClient.removeGroupUsers(groupId, userIds).then(
            (value: any) => {
                dispatch({
                    type: userGroupActionTypes.DELETE_USER_GROUP_MAPPING_SUCCEEDED,
                    payload: {
                        groupId: groupId,
                        userIds: userIds
                    },
                });
            },
            (error: any) => {
                console.log(error)
                dispatch({
                    type: userGroupActionTypes.DELETE_USER_GROUP_MAPPING_FAILED,
                    payload: error
                });
            }
        )
    }
};