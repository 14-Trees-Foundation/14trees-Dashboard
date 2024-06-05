import { UnknownAction } from "redux";
import { PondsDataState, Pond, PondPaginationResponse, PondHistoryDataState } from "../../types/pond";
import pondActionTypes from "../actionTypes/pondActionTypes";

export const pondsDataReducer = (state = { totalPonds:0, ponds: {}}, action: UnknownAction ): PondsDataState => {
    switch (action.type) {
        case pondActionTypes.GET_PONDS_SUCCEEDED:
            if (action.payload) {
                let pondDataState: PondsDataState = { totalPonds: state.totalPonds, ponds: { ...state.ponds }};
                let payload = action.payload as PondPaginationResponse;
                if (pondDataState.totalPonds !== payload.total ) {
                    pondDataState.ponds = {}
                }
                pondDataState.totalPonds = payload.total;
                let ponds = payload.result;
                for (let i = 0; i < ponds.length; i++) {
                    if (ponds[i]?._id) {
                        ponds[i].key = ponds[i]._id
                        pondDataState.ponds[ponds[i]._id] = ponds[i]
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
                payload.key = payload._id
                nextState.ponds[payload._id] = payload;
                nextState.totalPonds += 1;
                return nextState;
            }
            return state;
        case pondActionTypes.UPDATE_POND_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalPonds: state.totalPonds, ponds: { ...state.ponds }} as PondsDataState;
                let payload = action.payload as Pond
                payload.key = payload._id
                nextState.ponds[payload._id] = payload;
                return nextState;
            }
            return state;
        case pondActionTypes.UPDATE_POND_WATER_LVL_SUCCEEDED:
            return state;
        case pondActionTypes.DELETE_POND_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalPonds: state.totalPonds, ponds: { ...state.ponds }} as PondsDataState;
                Reflect.deleteProperty(nextState.ponds, action.payload as string)
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
                    if (payload[i]?._id) {
                        payload[i].key = payload[i]._id
                        pondsDataState.ponds[payload[i]._id] = payload[i]
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

export const pondHistoryDataReducer = (state = {}, action: UnknownAction): PondHistoryDataState | {} => {
    switch(action.type) {
        case pondActionTypes.GET_POND_HISTORY_SUCCEEDED:
            if (action.payload) {
                let payload = action.payload as Pond[]
                if (payload.length !== 0) {
                    return payload[0];
                }
            }
            return state;
        default:
            return state;
    }
}