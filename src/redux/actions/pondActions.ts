import ApiClient from "../../api/apiClient/apiClient";
import pondActionTypes from "../actionTypes/pondActionTypes";
import { Pond, PondPaginationResponse } from "../../types/pond";

export const getPonds = (offset: number, limit: number) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: pondActionTypes.GET_PONDS_REQUESTED,
        });
        apiClient.getPonds(offset, limit).then(
            (value: PondPaginationResponse) => {
                for (let i = 0; i < value.result.length; i++) {
                    if (value.result[i]?._id) {
                        value.result[i].key = value.result[i]._id
                    }
                }
                dispatch({
                    type: pondActionTypes.GET_PONDS_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.log(error)
                dispatch({
                    type: pondActionTypes.GET_PONDS_FAILED,
                    payload: error
                });
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
                    if (value[i]?._id) {
                        value[i].key = value[i]._id
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
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: pondActionTypes.CREATE_POND_FAILED,
                });
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
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: pondActionTypes.UPDATE_POND_FAILED,
                });
            }
        )
    };
};


export const updatePondWaterLevel = (pondName: string, levelFt: number, userId: string, file?: Blob) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: pondActionTypes.UPDATE_POND_WATER_LVL_REQUESTED,
        });
        apiClient.updatePondWaterLevel(pondName, levelFt, userId, file).then(
            () => {
                dispatch({
                    type: pondActionTypes.UPDATE_POND_WATER_LVL_SUCCEEDED,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: pondActionTypes.UPDATE_POND_WATER_LVL_FAILED,
                });
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
            (id: string) => {
                dispatch({
                    type: pondActionTypes.DELETE_POND_SUCCEEDED,
                    payload: id,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: pondActionTypes.DELETE_POND_FAILED,
                });
            }
        )
    };
};