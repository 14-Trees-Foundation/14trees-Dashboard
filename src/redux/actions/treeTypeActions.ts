import ApiClient from "../../api/apiClient/apiClient";
import treeTypeActionTypes from "../actionTypes/treeTypeActionTypes";
import { TreeType, TreeTypePaginationResponse } from "../../types/treeType";

export const getTreeTypes = (offset: number, limit: number, name?: string) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: treeTypeActionTypes.GET_TREE_TYPES_REQUESTED,
        });
        apiClient.getTreeTypes(offset, limit, name).then(
            (value: TreeTypePaginationResponse) => {
                for (let i = 0; i < value.result.length; i++) {
                    if (value.result[i]?._id) {
                        value.result[i].key = value.result[i]._id
                    }
                }
                dispatch({
                    type: treeTypeActionTypes.GET_TREE_TYPES_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.log(error)
                dispatch({
                    type: treeTypeActionTypes.GET_TREE_TYPES_FAILED,
                    payload: error
                });
            }
        )
    }
};

export const getTreeTypesByFilters = (offset: number, limit: number, filters?: any[]) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: treeTypeActionTypes.GET_TREE_TYPES_REQUESTED,
        });
        apiClient.getTreeTypesByFilters(offset, limit, filters).then(
            (value: TreeTypePaginationResponse) => {
                for (let i = 0; i < value.result.length; i++) {
                    if (value.result[i]?._id) {
                        value.result[i].key = value.result[i]._id
                    }
                }
                dispatch({
                    type: treeTypeActionTypes.GET_TREE_TYPES_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.log(error)
                dispatch({
                    type: treeTypeActionTypes.GET_TREE_TYPES_FAILED,
                    payload: error
                });
            }
        )
    }
};

export const searchTreeTypes = (searchStr: string) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: treeTypeActionTypes.SEARCH_TREE_TYPES_REQUESTED,
        });
        apiClient.searchTreeTypes(searchStr).then(
            (value: TreeType[]) => {
                for (let i = 0; i < value.length; i++) {
                    if (value[i]?._id) {
                        value[i].key = value[i]._id
                    }
                }
                dispatch({
                    type: treeTypeActionTypes.SEARCH_TREE_TYPES_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.log(error)
                dispatch({
                    type: treeTypeActionTypes.SEARCH_TREE_TYPES_FAILED,
                    payload: error
                });
            }
        )
    }
};

export const createTreeType = (record: TreeType, file?: Blob) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: treeTypeActionTypes.CREATE_TREE_TYPE_REQUESTED,
        });
        apiClient.createTreeType(record, file).then(
            (value: TreeType) => {
                dispatch({
                    type: treeTypeActionTypes.CREATE_TREE_TYPE_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: treeTypeActionTypes.CREATE_TREE_TYPE_FAILED,
                });
            }
        )
    };
};

export const updateTreeType = (record: TreeType, file?: Blob) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: treeTypeActionTypes.UPDATE_TREE_TYPE_REQUESTED,
        });
        apiClient.updateTreeType(record, file).then(
            (value: TreeType) => {
                dispatch({
                    type: treeTypeActionTypes.UPDATE_TREE_TYPE_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: treeTypeActionTypes.UPDATE_TREE_TYPE_FAILED,
                });
            }
        )
    };
};


export const deleteTreeType = (record: TreeType) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: treeTypeActionTypes.DELETE_TREE_TYPE_REQUESTED,
        });
        apiClient.deleteTreeType(record).then(
            (id: string) => {
                dispatch({
                    type: treeTypeActionTypes.DELETE_TREE_TYPE_SUCCEEDED,
                    payload: id,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: treeTypeActionTypes.DELETE_TREE_TYPE_FAILED,
                });
            }
        )
    };
};