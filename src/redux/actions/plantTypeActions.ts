import ApiClient from "../../api/apiClient/apiClient";
import plantTypeActionTypes from "../actionTypes/plantTypeActionTypes";
import { PlantType } from "../../types/plantType";
import { PaginatedResponse } from "../../types/pagination";

export const getPlantTypes = (offset: number, limit: number, filters?: any[]) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: plantTypeActionTypes.GET_PLANT_TYPES_REQUESTED,
        });
        apiClient.getPlantTypes(offset, limit, filters).then(
            (value: PaginatedResponse<PlantType>) => {
                for (let i = 0; i < value.results.length; i++) {
                    if (value.results[i]?.id) {
                        value.results[i].key = value.results[i].id
                    }
                }
                dispatch({
                    type: plantTypeActionTypes.GET_PLANT_TYPES_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.log(error)
                dispatch({
                    type: plantTypeActionTypes.GET_PLANT_TYPES_FAILED,
                    payload: error
                });
            }
        )
    }
};

export const searchPlantTypes = (searchStr: string) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: plantTypeActionTypes.SEARCH_PLANT_TYPES_REQUESTED,
        });
        apiClient.searchPlantTypes(searchStr).then(
            (value: PlantType[]) => {
                for (let i = 0; i < value.length; i++) {
                    if (value[i]?.id) {
                        value[i].key = value[i].id
                    }
                }
                dispatch({
                    type: plantTypeActionTypes.SEARCH_PLANT_TYPES_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.log(error)
                dispatch({
                    type: plantTypeActionTypes.SEARCH_PLANT_TYPES_FAILED,
                    payload: error
                });
            }
        )
    }
};

export const createPlantType = (record: PlantType, file?: Blob) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: plantTypeActionTypes.CREATE_PLANT_TYPE_REQUESTED,
        });
        apiClient.createPlantType(record, file).then(
            (value: PlantType) => {
                dispatch({
                    type: plantTypeActionTypes.CREATE_PLANT_TYPE_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: plantTypeActionTypes.CREATE_PLANT_TYPE_FAILED,
                });
            }
        )
    };
};

export const updatePlantType = (record: PlantType, file?: Blob) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: plantTypeActionTypes.UPDATE_PLANT_TYPE_REQUESTED,
        });
        apiClient.updatePlantType(record, file).then(
            (value: PlantType) => {
                dispatch({
                    type: plantTypeActionTypes.UPDATE_PLANT_TYPE_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: plantTypeActionTypes.UPDATE_PLANT_TYPE_FAILED,
                });
            }
        )
    };
};


export const deletePlantType = (record: PlantType) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: plantTypeActionTypes.DELETE_PLANT_TYPE_REQUESTED,
        });
        apiClient.deletePlantType(record).then(
            (id: number) => {
                dispatch({
                    type: plantTypeActionTypes.DELETE_PLANT_TYPE_SUCCEEDED,
                    payload: id,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: plantTypeActionTypes.DELETE_PLANT_TYPE_FAILED,
                });
            }
        )
    };
};