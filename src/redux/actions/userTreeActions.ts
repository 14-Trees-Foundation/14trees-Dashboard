import ApiClient from "../../api/apiClient/apiClient";
import userTreeActionTypes from "../actionTypes/userTreeActionTypes";
import { AssignTreeRequest, UserTree, UserTreeCountPaginationResponse } from "../../types/userTree";
import { toast } from "react-toastify";

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
                toast.success("Trees unassigned successfully");
                dispatch({
                    type: userTreeActionTypes.UNASSIGN_USER_TREES_SUCCEEDED,
                });
            },
            (error: any) => {
                toast.error("Failed to unassign trees");
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
                dispatch({
                    type: userTreeActionTypes.UN_MAP_TREES_SUCCEEDED,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: userTreeActionTypes.UN_MAP_TREES_FAILED,
                    value: error
                });
            }
        )
    };
}

export const mapTrees = (saplingIds: string[], email: string) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: userTreeActionTypes.MAP_USER_TREES_REQUESTED,
        });
        apiClient.mapTrees(saplingIds, email).then(
            () => {
                dispatch({
                    type: userTreeActionTypes.MAP_USER_TREES_SUCCEEDED,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: userTreeActionTypes.MAP_USER_TREES_FAILED,
                    value: error
                });
            }
        )
    };
}

export const mapTreesForPlot = (email: string, plotId: string, count: number) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: userTreeActionTypes.MAP_USER_TREES_IN_PLOT_REQUESTED,
        });
        apiClient.mapTreesForPlot(email, plotId, count).then(
            () => {
                dispatch({
                    type: userTreeActionTypes.MAP_USER_TREES_IN_PLOT_SUCCEEDED,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: userTreeActionTypes.MAP_USER_TREES_IN_PLOT_FAILED,
                    value: error
                });
            }
        )
    };
}

export const assignTrees = (data: AssignTreeRequest) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: userTreeActionTypes.ASSIGN_USER_TREES_REQUESTED,
        });
        apiClient.assignUserTrees(data).then(
            () => {
                dispatch({
                    type: userTreeActionTypes.ASSIGN_USER_TREES_SUCCEEDED,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: userTreeActionTypes.ASSIGN_USER_TREES_FAILED,
                    value: error
                });
            }
        )
    };
}