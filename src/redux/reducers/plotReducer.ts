import { UnknownAction } from "redux";
import { PlotsDataState, Plot } from "../../types/plot";
import plotActionTypes from "../actionTypes/plotActionTypes";
import { PaginatedResponse } from "../../types/pagination";

export const plotsDataReducer = (state = { totalPlots:0, plots: {}, paginationMapping: {} }, action: UnknownAction ): PlotsDataState => {
    switch (action.type) {
        case plotActionTypes.GET_PLOTS_SUCCEEDED:
            if (action.payload) {

                let plotsDataState: PlotsDataState = { 
                    totalPlots: state.totalPlots, 
                    plots: { ...state.plots }, 
                    paginationMapping: { ...state.paginationMapping }
                };

                let payload = action.payload as PaginatedResponse<Plot>;
                let plots = payload.results;
                const offset = payload.offset;

                if (payload.offset === 0){ 
                    plotsDataState.plots = {}
                    plotsDataState.paginationMapping = {}
                }
                for (let i = 0; i < plots.length; i++) {
                    if (plots[i]?.id) {
                        plots[i].key = plots[i].id
                        plotsDataState.plots[plots[i].id] = plots[i]
                        plotsDataState.paginationMapping[offset + i] = plots[i].id
                    }
                }
                return {...plotsDataState, totalPlots: payload.total};
            }
            return state;
        case plotActionTypes.CREATE_PLOT_SUCCEEDED:
            if (action.payload) {
                const nextState: PlotsDataState = { 
                    totalPlots: state.totalPlots, 
                    plots: { ...state.plots },
                    paginationMapping: { ...state.paginationMapping }
                };

                let payload = action.payload as Plot
                payload.key = payload.id
                nextState.plots[payload.id] = payload;
                nextState.totalPlots += 1;
                return nextState;
            }
            return state;
        case plotActionTypes.UPDATE_PLOT_SUCCEEDED:
            if (action.payload) {
                const nextState: PlotsDataState = { 
                    totalPlots: state.totalPlots, 
                    plots: { ...state.plots },
                    paginationMapping: { ...state.paginationMapping }
                };

                let payload = action.payload as Plot
                payload.key = payload.id
                nextState.plots[payload.id] = payload;
                return nextState;
            }
            return state;
        case plotActionTypes.DELETE_PLOT_SUCCEEDED:
            if (action.payload) {
                const nextState: PlotsDataState = { 
                    totalPlots: state.totalPlots, 
                    plots: { ...state.plots },
                    paginationMapping: { ...state.paginationMapping }
                };

                Reflect.deleteProperty(nextState.plots, action.payload as number)
                nextState.totalPlots -= 1;
                return nextState;
            }
            return state;
        
        default:
            return state;
    }
};

export const searchPlotsDataReducer = (state = { totalPlots:0, plots: {}, paginationMapping: {} }, action: UnknownAction ): PlotsDataState => {
    switch(action.type) {
        case plotActionTypes.SEARCH_PLOTS_SUCCEEDED:
            if (action.payload) {
                let plotsDataState: PlotsDataState = { 
                    totalPlots: state.totalPlots, 
                    plots: { ...state.plots },
                    paginationMapping: { ...state.paginationMapping }
                }
                let payload = action.payload as [Plot]

                for (let i = 0; i < payload.length; i++) {
                    if (payload[i]?.id) {
                        payload[i].key = payload[i].id
                        plotsDataState.plots[payload[i].id] = payload[i]
                    }
                }
                const nextState: PlotsDataState = plotsDataState;
                return nextState;
            }
            return state;
        default:
            return state;
    }
}

export const getPlotTagsDataReducer = (state = new Set<string>(), action: UnknownAction ): Set<string> => {
    switch(action.type) {
        case plotActionTypes.GET_PLOT_TAGS_SUCCEEDED:
            if (action.payload) {
                let tags = new Set<string>();
                let payload = action.payload as PaginatedResponse<string>
                payload.results.forEach(tag => tags.add(tag))
                return tags
            }
            return state;
        default:
            return state;
    }
}