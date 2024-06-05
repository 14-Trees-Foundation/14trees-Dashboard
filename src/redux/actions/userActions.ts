import ApiClient from "../../api/apiClient/apiClient";
import userActionTypes from "../actionTypes/userActionTypes";
import { User, UserPaginationResponse } from "../../types/user";

export const getUsers = (offset: number, limit: number) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: userActionTypes.GET_USERS_REQUESTED,
        });
        apiClient.getUsers(offset, limit).then(
            (value: UserPaginationResponse) => {
                for (let i = 0; i < value.result.length; i++) {
                    if (value.result[i]?._id) {
                        value.result[i].key = value.result[i]._id
                    }
                }
                dispatch({
                    type: userActionTypes.GET_USERS_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.log(error)
                dispatch({
                    type: userActionTypes.GET_USERS_FAILED,
                    payload: error
                });
            }
        )
    }
};

export const getUsersByFilters = (offset: number, limit: number, filters?: any[]) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: userActionTypes.GET_USERS_REQUESTED,
        });
        apiClient.getUsersByFilters(offset, limit, filters).then(
            (value: UserPaginationResponse) => {
                for (let i = 0; i < value.result.length; i++) {
                    if (value.result[i]?._id) {
                        value.result[i].key = value.result[i]._id
                    }
                }
                dispatch({
                    type: userActionTypes.GET_USERS_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.log(error)
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
                    if (value[i]?._id) {
                        value[i].key = value[i]._id
                    }
                }
                dispatch({
                    type: userActionTypes.SEARCH_USERS_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.log(error)
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
                dispatch({
                    type: userActionTypes.CREATE_USER_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.error(error);
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
                dispatch({
                    type: userActionTypes.CREATE_BULK_USERS_SUCCEEDED,
                });
            },
            (error: any) => {
                console.error(error);
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
                dispatch({
                    type: userActionTypes.UPDATE_USER_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.error(error);
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
            (id: string) => {
                dispatch({
                    type: userActionTypes.DELETE_USER_SUCCEEDED,
                    payload: id,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: userActionTypes.DELETE_USER_FAILED,
                });
            }
        )
    };
};