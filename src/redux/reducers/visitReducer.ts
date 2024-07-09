import { Visit, VistsDataState } from "../../types/visits";
import { UnknownAction } from "redux";

import visitActionTypes from "../actionTypes/visitActionTypes";
import { PaginatedResponse } from "../../types/pagination";


export const visitsDataReducer = (state = { totalVisits: 0, visits: {} }, action: UnknownAction): VistsDataState => {
    switch (action.type) {
        case visitActionTypes.GET_VISITS_SUCCEEDED:
            if (action.payload) {
                let visitsDataState: VistsDataState = { totalVisits: state.totalVisits, visits: { ...state.visits } };
                let payload = action.payload as PaginatedResponse<Visit>;
                console.log(payload)
                if (visitsDataState.totalVisits !== payload.total) {
                    visitsDataState.visits = {}
                }
                visitsDataState.totalVisits = payload.total;
                let visits = payload.results;

                for (let i = 0; i < visits.length; i++) {
                    if (visits[i]?.id) {
                        visits[i].key = visits[i].id
                        visitsDataState.visits[visits[i].id] = visits[i]
                    }
                }

                const nextState: VistsDataState = visitsDataState;
                return nextState;
            }
            return state;

        case visitActionTypes.CREATE_VISIT_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalVisits: state.totalVisits, visits: { ...state.visits } } as VistsDataState;
                let payload = action.payload as Visit

                nextState.visits[payload.id] = payload;
                nextState.totalVisits += 1;
                return nextState;
            }
            return state;
        case visitActionTypes.UPDATE_VISIT_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalVisits: state.totalVisits, visits: { ...state.visits } } as VistsDataState;
                let payload = action.payload as Visit

                nextState.visits[payload.id] = payload;
                return nextState;
            }
            return state;
        case visitActionTypes.DELETE_VISIT_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalVisits: state.totalVisits, visits: { ...state.visits } } as VistsDataState;
                Reflect.deleteProperty(nextState.visits, action.payload as number)
                nextState.totalVisits -= 1;
                return nextState;
            }
            return state;

        default:
            return state;
    }
};

