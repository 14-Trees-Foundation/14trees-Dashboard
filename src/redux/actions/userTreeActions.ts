import ApiClient from "../../api/apiClient/apiClient";
import userTreeActionTypes from "../actionTypes/userTreeActionTypes";
import { UserTree } from "../../types/userTree";

export const getUserTrees = () => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: userTreeActionTypes.GET_USER_TREES_REQUESTED,
        });
        apiClient.getUserTrees().then(
            (value: UserTree[]) => {
                for (let i = 0; i < value.length; i++) {
                    if (value[i]?._id) {
                        value[i].key = value[i]._id
                    }
                }
                dispatch({
                    type: userTreeActionTypes.GET_USER_TREES_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.log(error)
                dispatch({
                    type: userTreeActionTypes.GET_USER_TREES_FAILED,
                    payload: error
                });
            }
        )
    }
};

export const createUserTree = (record: UserTree) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: userTreeActionTypes.CREATE_USER_TREE_REQUESTED,
        });
        apiClient.createUserTree(record).then(
            (value: UserTree) => {
                dispatch({
                    type: userTreeActionTypes.CREATE_USER_TREE_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: userTreeActionTypes.CREATE_USER_TREE_FAILED,
                });
            }
        )
    };
};

export const updateUserTree = (record: UserTree) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: userTreeActionTypes.UPDATE_USER_TREE_REQUESTED,
        });
        apiClient.updateUserTree(record).then(
            (value: UserTree) => {
                dispatch({
                    type: userTreeActionTypes.UPDATE_USER_TREE_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: userTreeActionTypes.UPDATE_USER_TREE_FAILED,
                });
            }
        )
    };
};


export const deleteUserTree = (record: UserTree) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: userTreeActionTypes.DELETE_USER_TREE_REQUESTED,
        });
        apiClient.deleteUserTree(record).then(
            (id: string) => {
                dispatch({
                    type: userTreeActionTypes.DELETE_USER_TREE_SUCCEEDED,
                    payload: id,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: userTreeActionTypes.DELETE_USER_TREE_FAILED,
                });
            }
        )
    };
};