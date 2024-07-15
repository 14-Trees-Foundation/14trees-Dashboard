import ApiClient from "../../api/apiClient/apiClient";
import userActionTypes from "../actionTypes/userActionTypes";
import { User } from "../../types/user";
import { toast } from "react-toastify";
import { PaginatedResponse } from "../../types/pagination";

export const getUsers = (offset: number, limit: number, filters?: any[]) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: userActionTypes.GET_USERS_REQUESTED,
        });
        apiClient.getUsers(offset, limit, filters).then(
            (value: PaginatedResponse<User>) => {
                for (let i = 0; i < value.results.length; i++) {
                    if (value.results[i]?.id) {
                        value.results[i].key = value.results[i].id
                    }
                }
                dispatch({
                    type: userActionTypes.GET_USERS_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                toast.error(error.message);
                dispatch({
                    type: userActionTypes.GET_USERS_FAILED,
                    payload: error
                });
            }
        )
    }
};

export const searchUsers = (searchStr: string) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: userActionTypes.SEARCH_USERS_REQUESTED,
        });
        apiClient.searchUsers(searchStr).then(
            (value: User[]) => {
                for (let i = 0; i < value.length; i++) {
                    if (value[i]?.id) {
                        value[i].key = value[i].id
                    }
                }
                dispatch({
                    type: userActionTypes.SEARCH_USERS_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                toast.error(error.message);
                dispatch({
                    type: userActionTypes.SEARCH_USERS_FAILED,
                    payload: error
                });
            }
        )
    }
};

export const createUser = (record: User) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: userActionTypes.CREATE_USER_REQUESTED,
        });
        apiClient.createUser(record).then(
            (value: User) => {
                toast.success("User created successfully");
                dispatch({
                    type: userActionTypes.CREATE_USER_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                toast.error(error.message)
                dispatch({
                    type: userActionTypes.CREATE_USER_FAILED,
                });
            }
        )
    };
};

export const createBulkUsers = (data: Blob) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: userActionTypes.CREATE_BULK_USERS_REQUESTED,
        });
        apiClient.createUsersBulk(data).then(
            () => {
                toast.success("Users created successfully");
                dispatch({
                    type: userActionTypes.CREATE_BULK_USERS_SUCCEEDED,
                });
            },
            (error: any) => {
                toast.error(error.message || "Failed to create users")
                dispatch({
                    type: userActionTypes.CREATE_BULK_USERS_SUCCEEDED,
                });
            }
        )
    };
};

export const updateUser = (record: User) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: userActionTypes.UPDATE_USER_REQUESTED,
        });
        apiClient.updateUser(record).then(
            (value: User) => {
                toast.success("User updated successfully");
                dispatch({
                    type: userActionTypes.UPDATE_USER_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                toast.error(error.message)
                dispatch({
                    type: userActionTypes.UPDATE_USER_FAILED,
                });
            }
        )
    };
};


export const deleteUser = (record: User) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: userActionTypes.DELETE_USER_REQUESTED,
        });
        apiClient.deleteUser(record).then(
            (id: number) => {
                toast.success("User deleted successfully");
                dispatch({
                    type: userActionTypes.DELETE_USER_SUCCEEDED,
                    payload: id,
                });
            },
            (error: any) => {
                toast.error(error.message)
                dispatch({
                    type: userActionTypes.DELETE_USER_FAILED,
                });
            }
        )
    };
};