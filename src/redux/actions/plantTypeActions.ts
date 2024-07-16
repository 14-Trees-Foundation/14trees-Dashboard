import ApiClient from "../../api/apiClient/apiClient";
import plantTypeActionTypes from "../actionTypes/plantTypeActionTypes";
import { PlantType } from "../../types/plantType";
import { PaginatedResponse } from "../../types/pagination";
import { toast } from "react-toastify";

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
                toast.error(`Failed to fetch plant types!`)
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

export const createPlantType = (record: PlantType, files?: Blob[]) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: plantTypeActionTypes.CREATE_PLANT_TYPE_REQUESTED,
        });
        apiClient.createPlantType(record, files?files:[]).then(
            (value: PlantType) => {
                toast.success(`Successfully created plant type!`);
                dispatch({
                    type: plantTypeActionTypes.CREATE_PLANT_TYPE_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.error(error);
                toast.error(`Failed to create plant type!`);
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
                toast.success(`Successfully updated plant type!`);
                dispatch({
                    type: plantTypeActionTypes.UPDATE_PLANT_TYPE_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.error(error);
                toast.error(`Failed to update plant type!`);
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
                toast.success(`Successfully deleted plant type!`);
                dispatch({
                    type: plantTypeActionTypes.DELETE_PLANT_TYPE_SUCCEEDED,
                    payload: id,
                });
            },
            (error: any) => {
                console.error(error);
                toast.error(`Failed to delete plant type!`);
                dispatch({
                    type: plantTypeActionTypes.DELETE_PLANT_TYPE_FAILED,
                });
            }
        )
    };
};