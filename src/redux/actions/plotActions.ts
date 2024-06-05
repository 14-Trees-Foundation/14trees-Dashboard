import ApiClient from "../../api/apiClient/apiClient";
import plotActionTypes from "../actionTypes/plotActionTypes";
import { Plot, PlotPaginationResponse } from "../../types/plot";

export const getPlots = (offset: number, limit: number, name?: string) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: plotActionTypes.GET_PLOTS_REQUESTED,
        });
        apiClient.getPlots(offset, limit, name).then(
            (value: PlotPaginationResponse) => {
                for (let i = 0; i < value.result.length; i++) {
                    if (value.result[i]?._id) {
                        value.result[i].key = value.result[i]._id
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

export const getPlotsByFilters = (offset: number, limit: number, filters?: any[]) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: plotActionTypes.GET_PLOTS_REQUESTED,
        });
        apiClient.getPlotsByFilters(offset, limit, filters).then(
            (value: PlotPaginationResponse) => {
                for (let i = 0; i < value.result.length; i++) {
                    if (value.result[i]?._id) {
                        value.result[i].key = value.result[i]._id
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

export const searchPlots = (searchStr: string) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: plotActionTypes.SEARCH_PLOTS_REQUESTED,
        });
        apiClient.searchPlots(searchStr).then(
            (value: Plot[]) => {
                for (let i = 0; i < value.length; i++) {
                    if (value[i]?._id) {
                        value[i].key = value[i]._id
                    }
                }
                dispatch({
                    type: plotActionTypes.SEARCH_PLOTS_SUCCEEDED,
                    payload: value,
                });
            },
            (error: any) => {
                console.log(error)
                dispatch({
                    type: plotActionTypes.SEARCH_PLOTS_FAILED,
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