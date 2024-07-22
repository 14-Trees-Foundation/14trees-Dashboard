import ApiClient from "../../api/apiClient/apiClient";
import userTreeActionTypes from "../actionTypes/userTreeActionTypes";
import { AssignTreeRequest, UserTree, UserTreeCountPaginationResponse } from "../../types/userTree";
import { toast } from "react-toastify";
import { MapTreesUsingPlotIdRequest, MapTreesUsingSaplingIdsRequest } from "../../types/tree";

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
                dispatch({
                    type: userTreeActionTypes.UPDATE_USER_TREE_FAILED,
                });
            }
        )
    };
};


export const unassignUserTrees = (saplingIds: string[]) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: userTreeActionTypes.UNASSIGN_USER_TREES_REQUESTED,
        });
        apiClient.unassignUserTrees(saplingIds).then(
            () => {
                toast.success("Unassigned trees successfully!");
                dispatch({
                    type: userTreeActionTypes.UNASSIGN_USER_TREES_SUCCEEDED,
                });
            },
            (error: any) => {
                console.error(error);
                toast.error("Failed to unassign trees!");
                dispatch({
                    type: userTreeActionTypes.UNASSIGN_USER_TREES_FAILED,
                });
            }
        )
    };
};


export const getUserTreeCount = (offset: number, limit: number, filters?: any) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: userTreeActionTypes.GET_USER_TREE_COUNT_REQUESTED,
        });
        apiClient.getUserTreeCount(offset, limit, filters).then(
            (result: UserTreeCountPaginationResponse) => {
                dispatch({
                    type: userTreeActionTypes.GET_USER_TREE_COUNT_SUCCEEDED,
                    payload: result,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: userTreeActionTypes.GET_USER_TREE_COUNT_FAILED,
                    value: error
                });
            }
        )
    };
};

export const unMapTrees = (saplingIds: string[]) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: userTreeActionTypes.UN_MAP_TREES_REQUESTED,
        });
        apiClient.removeTreeMappings(saplingIds).then(
            () => {
                toast.success("Unmapped trees successfully!");
                dispatch({
                    type: userTreeActionTypes.UN_MAP_TREES_SUCCEEDED,
                });
            },
            (error: any) => {
                console.error(error);
                toast.error("Failed to unmap trees!");
                dispatch({
                    type: userTreeActionTypes.UN_MAP_TREES_FAILED,
                    value: error
                });
            }
        )
    };
}

export const mapTrees = (request: MapTreesUsingSaplingIdsRequest) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: userTreeActionTypes.MAP_USER_TREES_REQUESTED,
        });
        apiClient.mapTrees(request).then(
            () => {
                toast.success("Mapped trees successfully!");
                dispatch({
                    type: userTreeActionTypes.MAP_USER_TREES_SUCCEEDED,
                });
            },
            (error: any) => {
                console.error(error);
                toast.error("Failed to map trees!");
                dispatch({
                    type: userTreeActionTypes.MAP_USER_TREES_FAILED,
                    value: error
                });
            }
        )
    };
}

export const mapTreesForPlot = (request: MapTreesUsingPlotIdRequest) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: userTreeActionTypes.MAP_USER_TREES_IN_PLOT_REQUESTED,
        });
        apiClient.mapTreesForPlot(request).then(
            () => {
                toast.success("Mapped trees successfully!");
                dispatch({
                    type: userTreeActionTypes.MAP_USER_TREES_IN_PLOT_SUCCEEDED,
                });
            },
            (error: any) => {
                console.error(error);
                toast.error("Failed to map trees!");
                dispatch({
                    type: userTreeActionTypes.MAP_USER_TREES_IN_PLOT_FAILED,
                    value: error
                });
            }
        )
    };
}

export const assignTrees = (data: FormData) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: userTreeActionTypes.ASSIGN_USER_TREES_REQUESTED,
        });
        apiClient.assignUserTrees(data).then(
            () => {
                toast.success("Assigned trees successfully!");
                dispatch({
                    type: userTreeActionTypes.ASSIGN_USER_TREES_SUCCEEDED,
                });
            },
            (error: any) => {
                console.error(error);
                toast.error("Failed to assign trees!");
                dispatch({
                    type: userTreeActionTypes.ASSIGN_USER_TREES_FAILED,
                    value: error
                });
            }
        )
    };
}