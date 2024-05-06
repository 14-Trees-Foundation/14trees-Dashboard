import ApiClient from "../../api/apiClient/apiClient";
import treeActionTypes from "../actionTypes/treeActionTypes";
import { Tree } from "../../types/tree";

export const getTrees = () => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: treeActionTypes.GET_TREES_REQUESTED,
        });
        apiClient.getTrees().then(
            (value: Tree[]) => {
                for (let i = 0; i < value.length; i++) {
                    if (value[i]?._id) {
                        value[i].key = value[i]._id
                    }
                }
                dispatch({
                    type: treeActionTypes.GET_TREES_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.log(error)
                dispatch({
                    type: treeActionTypes.GET_TREES_FAILED,
                    payload: error
                });
            }
        )
    }
};

export const createTree = (record: Tree) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: treeActionTypes.CREATE_TREE_REQUESTED,
        });
        apiClient.createTree(record).then(
            (value: Tree) => {
                dispatch({
                    type: treeActionTypes.CREATE_TREE_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: treeActionTypes.CREATE_TREE_FAILED,
                });
            }
        )
    };
};

export const updateTree = (record: Tree) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: treeActionTypes.UPDATE_TREE_REQUESTED,
        });
        apiClient.updateTree(record).then(
            (value: Tree) => {
                dispatch({
                    type: treeActionTypes.UPDATE_TREE_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: treeActionTypes.UPDATE_TREE_FAILED,
                });
            }
        )
    };
};


export const deleteTree = (record: Tree) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: treeActionTypes.DELETE_TREE_REQUESTED,
        });
        apiClient.deleteTree(record).then(
            (id: string) => {
                dispatch({
                    type: treeActionTypes.DELETE_TREE_SUCCEEDED,
                    payload: id,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: treeActionTypes.DELETE_TREE_FAILED,
                });
            }
        )
    };
};


export const createBulkTrees = (data: Blob) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: treeActionTypes.CREATE_BULK_TREES_REQUESTED,
        });
        apiClient.createTreeBulk(data).then(
            () => {
                dispatch({
                    type: treeActionTypes.CREATE_BULK_TREES_SUCCEEDED,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: treeActionTypes.CREATE_BULK_TREES_FAILED,
                });
            }
        )
    };
};