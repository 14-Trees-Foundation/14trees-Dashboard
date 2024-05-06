import ApiClient from "../../api/apiClient/apiClient";
import plotActionTypes from "../actionTypes/plotActionTypes";
import { Plot } from "../../types/plot";

export const getPlots = () => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: plotActionTypes.GET_PLOTS_REQUESTED,
        });
        apiClient.getPlots().then(
            (value: Plot[]) => {
                for (let i = 0; i < value.length; i++) {
                    if (value[i]?._id) {
                        value[i].key = value[i]._id
                    }
                }
                dispatch({
                    type: plotActionTypes.GET_PLOTS_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.log(error)
                dispatch({
                    type: plotActionTypes.GET_PLOTS_FAILED,
                    payload: error
                });
            }
        )
    }
};

export const createPlot = (record: Plot) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: plotActionTypes.CREATE_PLOT_REQUESTED,
        });
        apiClient.createPlot(record).then(
            (value: Plot) => {
                dispatch({
                    type: plotActionTypes.CREATE_PLOT_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: plotActionTypes.CREATE_PLOT_FAILED,
                });
            }
        )
    };
};

export const updatePlot = (record: Plot) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: plotActionTypes.UPDATE_PLOT_REQUESTED,
        });
        apiClient.updatePlot(record).then(
            (value: Plot) => {
                dispatch({
                    type: plotActionTypes.UPDATE_PLOT_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: plotActionTypes.UPDATE_PLOT_FAILED,
                });
            }
        )
    };
};


export const deletePlot = (record: Plot) => {
    const apiClient = new ApiClient();
    return (dispatch: any) => {
        dispatch({
            type: plotActionTypes.DELETE_PLOT_REQUESTED,
        });
        apiClient.deletePlot(record).then(
            (id: string) => {
                dispatch({
                    type: plotActionTypes.DELETE_PLOT_SUCCEEDED,
                    payload: id,
                });
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: plotActionTypes.DELETE_PLOT_FAILED,
                });
            }
        )
    };
};