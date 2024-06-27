import ApiClient from "../../api/apiClient/apiClient";
import pondActionTypes from "../actionTypes/pondActionTypes";
import { PondWaterLevelUpdate } from "../../types/pond";
import { PaginatedResponse } from "../../types/pagination";
import { toast } from "react-toastify";

export const getPondWaterLevelUpdates = (pondId: number, offset: number, limit: number) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: pondActionTypes.GET_POND_WATER_LEVEL_UPDATES_REQUESTED,
        });
        apiClient.getPondWaterLevelUpdates(pondId, offset, limit).then(
            (value: PaginatedResponse<PondWaterLevelUpdate>) => {
                for (let i = 0; i < value.results.length; i++) {
                    if (value.results[i]?.id) {
                        value.results[i].key = value.results[i].id
                    }
                }
                toast.success('Pond water level updates retrieved successfully')
                dispatch({
                    type: pondActionTypes.GET_POND_WATER_LEVEL_UPDATES_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                toast.error(error.message)
                dispatch({
                    type: pondActionTypes.GET_POND_WATER_LEVEL_UPDATES_FAILED,
                    payload: error
                });
            }
        )
    }
}

export const addPondWaterLevelUpdate = (pondId: number, levelFt: number, userId: number, file?: Blob) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: pondActionTypes.CREATE_POND_WATER_LEVEL_UPDATE_REQUESTED,
        });
        apiClient.addPondWaterLevelUpdate(pondId, levelFt, userId, file).then(
            (value: PondWaterLevelUpdate) => {
                toast.success('Pond water level update Added successfully')
                dispatch({
                    type: pondActionTypes.CREATE_POND_WATER_LEVEL_UPDATE_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                toast.error(error.message)
                dispatch({
                    type: pondActionTypes.CREATE_POND_WATER_LEVEL_UPDATE_FAILED,
                    payload: error
                });
            }
        )
    }
}

export const updatePondWaterLevelUpdate = (data: PondWaterLevelUpdate) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: pondActionTypes.UPDATE_POND_WATER_LEVEL_UPDATE_REQUESTED,
        });
        apiClient.updatePondWaterLevelUpdate(data).then(
            (value: PondWaterLevelUpdate) => {
                toast.success('Pond water level update updated successfully')
                dispatch({
                    type: pondActionTypes.UPDATE_POND_WATER_LEVEL_UPDATE_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                toast.error(error.message)
                dispatch({
                    type: pondActionTypes.UPDATE_POND_WATER_LEVEL_UPDATE_FAILED,
                    payload: error
                });
            }
        ) 
    }
}

export const deletePondWaterLevelUpdate = (data: PondWaterLevelUpdate) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: pondActionTypes.DELETE_POND_WATER_LEVEL_UPDATE_REQUESTED,
        });
        apiClient.deletePondWaterLevelUpdate(data).then(
            (value: number) => {
                toast.success('Pond water level update deleted successfully')
                dispatch({
                    type: pondActionTypes.DELETE_POND_WATER_LEVEL_UPDATE_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                toast.error(error.message)
                dispatch({
                    type: pondActionTypes.DELETE_POND_WATER_LEVEL_UPDATE_FAILED,
                    payload: error
                });
            }
        )
    }
}