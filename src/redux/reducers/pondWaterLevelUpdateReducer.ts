import { UnknownAction } from "redux";
import { PondWaterLevelUpdatesDataState, PondWaterLevelUpdate } from "../../types/pond";
import pondActionTypes from "../actionTypes/pondActionTypes";
import { PaginatedResponse } from "../../types/pagination";

export const pondWaterLevelUpdatesDataReducer = (state = { totalPondWaterLevelUpdates:0, pondWaterLevelUpdates: {}}, action: UnknownAction ): PondWaterLevelUpdatesDataState => {
    switch (action.type) {
        case pondActionTypes.GET_POND_WATER_LEVEL_UPDATES_SUCCEEDED:
            if (action.payload) {
                let pondDataState: PondWaterLevelUpdatesDataState = { totalPondWaterLevelUpdates: state.totalPondWaterLevelUpdates, pondWaterLevelUpdates: { ...state.pondWaterLevelUpdates }};
                let payload = action.payload as PaginatedResponse<PondWaterLevelUpdate>;
                if (pondDataState.totalPondWaterLevelUpdates !== payload.total ) {
                    pondDataState.pondWaterLevelUpdates = {}
                }
                pondDataState.totalPondWaterLevelUpdates = payload.total;
                let pondWaterLevelUpdates = payload.results;
                for (let i = 0; i < pondWaterLevelUpdates.length; i++) {
                    if (pondWaterLevelUpdates[i]?.id) {
                        pondWaterLevelUpdates[i].key = pondWaterLevelUpdates[i].id
                        pondDataState.pondWaterLevelUpdates[pondWaterLevelUpdates[i].id] = pondWaterLevelUpdates[i]
                    }
                }
                const nextState: PondWaterLevelUpdatesDataState = pondDataState;
                return nextState;
            }
            return state;
        
        default:
            return state;
    }
};