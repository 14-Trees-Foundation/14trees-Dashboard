import { Visit, VisitsDataState } from "../../types/visits";
import { UnknownAction } from "redux";

import visitActionTypes from "../actionTypes/visitActionTypes";
import { PaginatedResponse } from "../../types/pagination";

export const visitsDataReducer = (state = { loading: false, totalVisits: 0, visits: {}, paginationMapping: {} }, action: UnknownAction): VisitsDataState => {
    switch (action.type) {
        case visitActionTypes.GET_VISITS_SUCCEEDED:
            if (action.payload) {
                let visitsDataState: VisitsDataState = {
                    loading: state.loading,
                    totalVisits: state.totalVisits,
                    visits: { ...state.visits },
                    paginationMapping: { ...state.paginationMapping }
                };
                let payload = action.payload as PaginatedResponse<Visit>;
                const offset = payload.offset;

                if (payload.offset === 0) {
                    visitsDataState.visits = {}
                    visitsDataState.paginationMapping = {}
                }

                let visits = payload.results;
                for (let i = 0; i < visits.length; i++) {
                    if (visits[i]?.id) {
                        visits[i].key = visits[i].id
                        visitsDataState.visits[visits[i].id] = visits[i]
                        visitsDataState.paginationMapping[offset + i] = visits[i].id
                    }
                }
                return { ...visitsDataState, loading: false, totalVisits: payload.total };
            }
            return state;

        case visitActionTypes.GET_VISITS_REQUESTED:
            return { totalVisits: state.totalVisits, visits: { ...state.visits }, paginationMapping: { ...state.paginationMapping }, loading: true };

        case visitActionTypes.GET_VISITS_FAILED:
            return { totalVisits: state.totalVisits, visits: { ...state.visits }, paginationMapping: { ...state.paginationMapping }, loading: false };

        case visitActionTypes.CREATE_VISIT_SUCCEEDED:
            if (action.payload) {
                const nextState = { 
                    loading: state.loading,
                    totalVisits: state.totalVisits, 
                    visits: { ...state.visits },
                    paginationMapping: { ...state.paginationMapping }
                } as VisitsDataState;

                let payload = action.payload as Visit
                payload.key = payload.id
                nextState.visits[payload.id] = payload;
                nextState.totalVisits += 1;
                return nextState;
            }
            return state;

        case visitActionTypes.UPDATE_VISIT_SUCCEEDED:
            if (action.payload) {
                const nextState = { 
                    loading: state.loading,
                    totalVisits: state.totalVisits, 
                    visits: { ...state.visits },
                    paginationMapping: { ...state.paginationMapping }
                } as VisitsDataState;

                let payload = action.payload as Visit
                payload.key = payload.id
                nextState.visits[payload.id] = payload;
                return nextState;
            }
            return state;

        case visitActionTypes.DELETE_VISIT_SUCCEEDED:
            if (action.payload) {
                const nextState = { 
                    loading: state.loading,
                    totalVisits: state.totalVisits, 
                    visits: { ...state.visits },
                    paginationMapping: { ...state.paginationMapping }
                } as VisitsDataState;

                Reflect.deleteProperty(nextState.visits, action.payload as number)
                nextState.totalVisits -= 1;
                return nextState;
            }
            return state;

        default:
            return state;
    }
};