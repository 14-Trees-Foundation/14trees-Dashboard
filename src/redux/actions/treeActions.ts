import ApiClient from "../../api/apiClient/apiClient";
import treeActionTypes from "../actionTypes/treeActionTypes";
import { PaginationTreeResponse, Tree } from "../../types/tree";
import { off } from "process";

export const getTrees = (offset: number, limit: number) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: treeActionTypes.GET_TREES_REQUESTED,
        });
        apiClient.getTrees(offset, limit).then(
            (value: PaginationTreeResponse) => {
                for (let i = 0; i < value.results.length; i++) {
                    if (value.results[i]?._id) {
                        value.results[i].key = value.results[i]._id
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

export const createTree = (record: Tree, file?:Blob) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: treeActionTypes.CREATE_TREE_REQUESTED,
        });
        apiClient.createTree(record, file).then(
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

export const updateTree = (record: Tree, file?: Blob) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: treeActionTypes.UPDATE_TREE_REQUESTED,
        });
        apiClient.updateTree(record, file).then(
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