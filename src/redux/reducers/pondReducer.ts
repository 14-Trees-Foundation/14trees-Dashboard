import { UnknownAction } from "redux";
import { PondsDataState, Pond } from "../../types/pond";
import pondActionTypes from "../actionTypes/pondActionTypes";
import { PaginatedResponse } from "../../types/pagination";

export const pondsDataReducer = (state = { totalPonds:0, ponds: {}}, action: UnknownAction ): PondsDataState => {
    switch (action.type) {
        case pondActionTypes.GET_PONDS_SUCCEEDED:
            if (action.payload) {
                let pondDataState: PondsDataState = { totalPonds: state.totalPonds, ponds: { ...state.ponds }};
                let payload = action.payload as PaginatedResponse<Pond>;
                if (pondDataState.totalPonds !== payload.total ) {
                    pondDataState.ponds = {}
                }
                pondDataState.totalPonds = payload.total;
                let ponds = payload.results;
                for (let i = 0; i < ponds.length; i++) {
                    if (ponds[i]?.id) {
                        ponds[i].key = ponds[i].id
                        pondDataState.ponds[ponds[i].id] = ponds[i]
                    }
                }
                const nextState: PondsDataState = pondDataState;
                return nextState;
            }
            return state;
        case pondActionTypes.CREATE_POND_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalPonds: state.totalPonds, ponds: { ...state.ponds }} as PondsDataState;
                let payload = action.payload as Pond
                payload.key = payload.id
                nextState.ponds[payload.id] = payload;
                nextState.totalPonds += 1;
                return nextState;
            }
            return state;
        case pondActionTypes.UPDATE_POND_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalPonds: state.totalPonds, ponds: { ...state.ponds }} as PondsDataState;
                let payload = action.payload as Pond
                payload.key = payload.id
                nextState.ponds[payload.id] = payload;
                return nextState;
            }
            return state;
        case pondActionTypes.DELETE_POND_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalPonds: state.totalPonds, ponds: { ...state.ponds }} as PondsDataState;
                Reflect.deleteProperty(nextState.ponds, action.payload as number)
                nextState.totalPonds -= 1;
                return nextState;
            }
            return state;
        
        default:
            return state;
    }
};

export const searchPondsDataReducer = (state = { totalPonds:0, ponds: {}}, action: UnknownAction ): PondsDataState => {
    switch(action.type) {
        case pondActionTypes.SEARCH_PONDS_SUCCEEDED:
            if (action.payload) {
                let pondsDataState: PondsDataState = { totalPonds: state.totalPonds, ponds: { ...state.ponds }};
                let payload = action.payload as [Pond]
                for (let i = 0; i < payload.length; i++) {
                    if (payload[i]?.id) {
                        payload[i].key = payload[i].id
                        pondsDataState.ponds[payload[i].id] = payload[i]
                    }
                }
                const nextState: PondsDataState = pondsDataState;
                return nextState;
            }
            return state;
        default:
            return state;
    }
}