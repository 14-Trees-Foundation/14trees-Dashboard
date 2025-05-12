import { UnknownAction } from "redux";
import { PondsDataState, Pond } from "../../types/pond";
import pondActionTypes from "../actionTypes/pondActionTypes";
import { PaginatedResponse } from "../../types/pagination";

export const pondsDataReducer = (state = { loading: false, totalPonds: 0, ponds: {}, paginationMapping: {} }, action: UnknownAction): PondsDataState => {
    switch (action.type) {
        case pondActionTypes.GET_PONDS_SUCCEEDED:
            if (action.payload) {
                let pondsDataState: PondsDataState = {
                    loading: state.loading,
                    totalPonds: state.totalPonds,
                    ponds: { ...state.ponds },
                    paginationMapping: { ...state.paginationMapping }
                };
                let payload = action.payload as PaginatedResponse<Pond>;
                const offset = payload.offset;

                if (payload.offset === 0) {
                    pondsDataState.ponds = {}
                    pondsDataState.paginationMapping = {}
                }

                let ponds = payload.results;
                for (let i = 0; i < ponds.length; i++) {
                    if (ponds[i]?.id) {
                        ponds[i].key = ponds[i].id
                        pondsDataState.ponds[ponds[i].id] = ponds[i]
                        pondsDataState.paginationMapping[offset + i] = ponds[i].id
                    }
                }
                return { ...pondsDataState, loading: false, totalPonds: payload.total };
            }
            return state;

        case pondActionTypes.GET_PONDS_REQUESTED:
            return { 
                totalPonds: state.totalPonds, 
                ponds: { ...state.ponds }, 
                paginationMapping: { ...state.paginationMapping }, 
                loading: true 
            };

        case pondActionTypes.GET_PONDS_FAILED:
            return { 
                totalPonds: state.totalPonds, 
                ponds: { ...state.ponds }, 
                paginationMapping: { ...state.paginationMapping }, 
                loading: false 
            };

        case pondActionTypes.CREATE_POND_SUCCEEDED:
            if (action.payload) {
                const nextState = { 
                    loading: state.loading,
                    totalPonds: state.totalPonds, 
                    ponds: { ...state.ponds },
                    paginationMapping: { ...state.paginationMapping }
                } as PondsDataState;

                let payload = action.payload as Pond;
                payload.key = payload.id;
                nextState.ponds[payload.id] = payload;
                nextState.totalPonds += 1;
                return nextState;
            }
            return state;

        case pondActionTypes.UPDATE_POND_SUCCEEDED:
            if (action.payload) {
                const nextState = { 
                    loading: state.loading,
                    totalPonds: state.totalPonds, 
                    ponds: { ...state.ponds },
                    paginationMapping: { ...state.paginationMapping }
                } as PondsDataState;

                let payload = action.payload as Pond;
                payload.key = payload.id;
                nextState.ponds[payload.id] = payload;
                return nextState;
            }
            return state;

        case pondActionTypes.DELETE_POND_SUCCEEDED:
            if (action.payload) {
                const nextState = { 
                    loading: state.loading,
                    totalPonds: state.totalPonds, 
                    ponds: { ...state.ponds },
                    paginationMapping: { ...state.paginationMapping }
                } as PondsDataState;

                Reflect.deleteProperty(nextState.ponds, action.payload as number);
                nextState.totalPonds -= 1;
                return nextState;
            }
            return state;

        default:
            return state;
    }
};

export const searchPondsDataReducer = (state = { loading: false, totalPonds: 0, ponds: {}, paginationMapping: {} }, action: UnknownAction): PondsDataState => {
    switch(action.type) {
        case pondActionTypes.SEARCH_PONDS_SUCCEEDED:
            if (action.payload) {
                let pondsDataState: PondsDataState = {
                    loading: false,
                    totalPonds: state.totalPonds,
                    ponds: { ...state.ponds },
                    paginationMapping: { ...state.paginationMapping }
                };
                let payload = action.payload as Pond[];
                
                // Reset state for new search results
                pondsDataState.ponds = {};
                pondsDataState.paginationMapping = {};
                
                for (let i = 0; i < payload.length; i++) {
                    if (payload[i]?.id) {
                        payload[i].key = payload[i].id;
                        pondsDataState.ponds[payload[i].id] = payload[i];
                        pondsDataState.paginationMapping[i] = payload[i].id;
                    }
                }
                return pondsDataState;
            }
            return state;
        default:
            return state;
    }
}