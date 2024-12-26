import ApiClient from "../../api/apiClient/apiClient";
import treeActionTypes from "../actionTypes/treeActionTypes";
import { Tree } from "../../types/tree";
import { PaginatedResponse } from "../../types/pagination";
import { toast } from "react-toastify";
import { Order } from "../../types/common";

export const getTrees = (offset: number, limit: number, filters?: any, orderBy?: Order[]) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: treeActionTypes.GET_TREES_REQUESTED,
        });
        apiClient.getTrees(offset, limit, filters, orderBy).then(
            (value: PaginatedResponse<Tree>) => {
                for (let i = 0; i < value.results.length; i++) {
                    if (value.results[i]?.id) {
                        value.results[i].key = value.results[i].id
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
                toast.error(`Failed to fetch trees!`)
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
                toast.success(`Successfully updated tree!`)
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: treeActionTypes.UPDATE_TREE_FAILED,
                });
                toast.error(`Failed to update tree!`)
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
            (id: number) => {
                dispatch({
                    type: treeActionTypes.DELETE_TREE_SUCCEEDED,
                    payload: id,
                });
                toast.success(`Successfully deleted tree!`)
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: treeActionTypes.DELETE_TREE_FAILED,
                });
                toast.error(`Failed to delete tree!`)
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

export const changeTreesPlot = (treeIds: number[], plotId: number) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: treeActionTypes.CHANGE_TREES_PLOT_REQUESTED,
        });
        apiClient.changeTreesPlot(treeIds, plotId).then(
            () => {
                dispatch({
                    type: treeActionTypes.CHANGE_TREES_PLOT_SUCCEEDED,
                });
                toast.success('Successfully changed plot!');
            },
            (error: any) => {
                dispatch({
                    type: treeActionTypes.CHANGE_TREES_PLOT_FAILED,
                });
                toast.error(error.message);
            }
        )
    }
};