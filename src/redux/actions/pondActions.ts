import ApiClient from "../../api/apiClient/apiClient";
import pondActionTypes from "../actionTypes/pondActionTypes";
import { Pond } from "../../types/pond";

export const getPonds = () => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: pondActionTypes.GET_PONDS_REQUESTED,
        });
        apiClient.getPonds().then(
            (value: Pond[]) => {
                for (let i = 0; i < value.length; i++) {
                    if (value[i]?._id) {
                        value[i].key = value[i]._id
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