import ApiClient from "../../api/apiClient/apiClient";
import pondActionTypes from "../actionTypes/pondActionTypes";
import { Pond } from "../../types/pond";
import { PaginatedResponse } from "../../types/pagination";
import { toast } from "react-toastify";

export const getPonds = (offset: number, limit: number, filters?: any[]) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: pondActionTypes.GET_PONDS_REQUESTED,
        });
        apiClient.getPonds(offset, limit, filters).then(
            (value: PaginatedResponse<Pond>) => {
                for (let i = 0; i < value.results.length; i++) {
                    if (value.results[i]?.id) {
                        value.results[i].key = value.results[i].id
                    }
                }
                dispatch({
                    type: pondActionTypes.GET_PONDS_SUCCEEDED,
                    payload: value,
                });
                toast.success(`Successfully fetched ponds!`)
            },
            (error: any) => {
                console.log(error)
                dispatch({
                    type: pondActionTypes.GET_PONDS_FAILED,
                    payload: error
                });
                toast.error(`Failed to fetch ponds!`)
            }
        )
    }
};

export const searchPonds = (searchStr: string) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: pondActionTypes.SEARCH_PONDS_REQUESTED,
        });
        apiClient.searchPonds(searchStr).then(
            (value: Pond[]) => {
                for (let i = 0; i < value.length; i++) {
                    if (value[i]?.id) {
                        value[i].key = value[i].id
                    }
                }
                dispatch({
                    type: pondActionTypes.SEARCH_PONDS_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.log(error)
                dispatch({
                    type: pondActionTypes.SEARCH_PONDS_FAILED,
                    payload: error
                });
            }
        )
    }
};

export const createPond = (record: Pond) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: pondActionTypes.CREATE_POND_REQUESTED,
        });
        apiClient.createPond(record).then(
            (value: Pond) => {
                dispatch({
                    type: pondActionTypes.CREATE_POND_SUCCEEDED,
                    payload: value,
                });
                toast.success(`Successfully created pond!`)
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: pondActionTypes.CREATE_POND_FAILED,
                });
                toast.error(`Failed to create pond!`)
            }
        )
    };
};

export const updatePond = (record: Pond) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: pondActionTypes.UPDATE_POND_REQUESTED,
        });
        apiClient.updatePond(record).then(
            (value: Pond) => {
                dispatch({
                    type: pondActionTypes.UPDATE_POND_SUCCEEDED,
                    payload: value,
                });
                toast.success(`Successfully updated pond!`)
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: pondActionTypes.UPDATE_POND_FAILED,
                });
                toast.error(`Failed to update pond!`)
            }
        )
    };
};


export const deletePond = (record: Pond) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: pondActionTypes.DELETE_POND_REQUESTED,
        });
        apiClient.deletePond(record).then(
            (id: number) => {
                dispatch({
                    type: pondActionTypes.DELETE_POND_SUCCEEDED,
                    payload: id,
                });
                toast.success(`Successfully deleted pond!`)
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: pondActionTypes.DELETE_POND_FAILED,
                });
                toast.error(`Failed to delete pond!`)
            }
        )
    };
};