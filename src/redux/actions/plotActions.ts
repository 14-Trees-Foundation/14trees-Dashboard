import ApiClient from "../../api/apiClient/apiClient";
import plotActionTypes from "../actionTypes/plotActionTypes";
import { Plot } from "../../types/plot";
import { PaginatedResponse } from "../../types/pagination";
import { toast } from "react-toastify";
import { Tag } from "../../types/tag";

export const getPlots = (offset: number, limit: number, filters?: any[], orderBy?: { column: string, order: 'ASC' | 'DESC' }[]) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: plotActionTypes.GET_PLOTS_REQUESTED,
        });
        apiClient.getPlots(offset, limit, filters, orderBy).then(
            (value: PaginatedResponse<Plot>) => {
                for (let i = 0; i < value.results.length; i++) {
                    if (value.results[i]?.id) {
                        value.results[i].key = value.results[i].id
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
                toast.error(`Failed to fetch plots!`)
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
                    if (value[i]?.id) {
                        value[i].key = value[i].id
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
                toast.success(`Successfully created plot!`)
                console.log("Payload of Add : ", value);
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: plotActionTypes.CREATE_PLOT_FAILED,
                });

                if (error?.response?.data?.error) toast.error(error?.response?.data?.error)
                else toast.error(`Failed to create plot!`)
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
                toast.success(`Successfully updated plot!`)
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: plotActionTypes.UPDATE_PLOT_FAILED,
                });
                toast.error(`Failed to update plot!`)
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
            (id: number) => {
                dispatch({
                    type: plotActionTypes.DELETE_PLOT_SUCCEEDED,
                    payload: id,
                });
                toast.success(`Successfully deleted plot!`)
            },
            (error: any) => {
                console.error(error);
                dispatch({
                    type: plotActionTypes.DELETE_PLOT_FAILED,
                });
                toast.error(`Failed to delete plot!`)
            }
        )
    };
};

export const assignPlotsToSite = (plotIds: number[], siteId: number) => {
    const apiClient = new ApiClient()
    return (dispatch: any) => {
        dispatch({
            type: plotActionTypes.ASSIGN_PLOTS_REQUESTED,
        });
        apiClient.assignPlotsToSite(plotIds, siteId).then(
            () => {
                dispatch({
                    type: plotActionTypes.ASSIGN_PLOTS_SUCCEEDED,
                });
                toast.success('Successfully assigned plots to site!');
            },
            (error: any) => {
                dispatch({
                    type: plotActionTypes.ASSIGN_PLOTS_FAILED,
                });
                toast.error(error.message);
            }
        )
    }
};