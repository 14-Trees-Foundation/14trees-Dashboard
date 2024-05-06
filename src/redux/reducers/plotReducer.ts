import { UnknownAction } from "redux";
import { PlotsDataState, Plot } from "../../types/plot";
import plotActionTypes from "../actionTypes/plotActionTypes";
import { fetchDataFromLocal } from "../../api/apiClient/apiClient";

export const plotsDataReducer = (state = fetchDataFromLocal("PlotsDataState"), action: UnknownAction ): PlotsDataState => {
    switch (action.type) {
        case plotActionTypes.GET_PLOTS_SUCCEEDED:
            if (action.payload) {
                let plotsDataState: PlotsDataState = {}
                let payload = action.payload as [Plot]
                for (let i = 0; i < payload.length; i++) {
                    if (payload[i]?._id) {
                        payload[i].key = payload[i]._id
                        plotsDataState[payload[i]._id] = payload[i]
                    }
                }
                const nextState: PlotsDataState = plotsDataState;
                return nextState;
            }
            return state;
        case plotActionTypes.CREATE_PLOT_SUCCEEDED:
            if (action.payload) {
                const nextState = { ...state } as PlotsDataState;
                let payload = action.payload as Plot
                payload.key = payload._id
                nextState[payload._id] = payload;
                return nextState;
            }
            return state;
        case plotActionTypes.UPDATE_PLOT_SUCCEEDED:
            if (action.payload) {
                const nextState = { ...state } as PlotsDataState;
                let payload = action.payload as Plot
                payload.key = payload._id
                nextState[payload._id] = payload;
                return nextState;
            }
            return state;
        case plotActionTypes.DELETE_PLOT_SUCCEEDED:
            if (action.payload) {
                const nextState = { ...state } as PlotsDataState;
                Reflect.deleteProperty(nextState, action.payload as string)
                return nextState;
            }
            return state;
        
        default:
            return state;
    }
};