import { UnknownAction } from "redux";
import { PlantTypesDataState, PlantType } from "../../types/plantType";
import plantTypeActionTypes from "../actionTypes/plantTypeActionTypes";
import { PaginatedResponse } from "../../types/pagination";

export const plantTypesDataReducer = (state = { totalPlantTypes: 0, plantTypes: {} }, action: UnknownAction ): PlantTypesDataState => {
    switch (action.type) {
        case plantTypeActionTypes.GET_PLANT_TYPES_SUCCEEDED:
            if (action.payload) {
                let plantTypesDataState: PlantTypesDataState = { totalPlantTypes: state.totalPlantTypes, plantTypes: { ...state.plantTypes} }
                let payload = action.payload as PaginatedResponse<PlantType>
                if (plantTypesDataState.totalPlantTypes !== payload.total) {
                    plantTypesDataState.plantTypes = {}
                }
                plantTypesDataState.totalPlantTypes = payload.total;
                let plantTypes = payload.results
                for (let i = 0; i < plantTypes.length; i++) {
                    if (plantTypes[i]?.id) {
                        plantTypes[i].key = plantTypes[i].id
                        plantTypesDataState.plantTypes[plantTypes[i].id] = plantTypes[i]
                    }
                }
                const nextState: PlantTypesDataState = plantTypesDataState;
                return nextState;
            }
            return state;
        case plantTypeActionTypes.CREATE_PLANT_TYPE_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalPlantTypes: state.totalPlantTypes, plantTypes: {...state.plantTypes} } as PlantTypesDataState;
                let payload = action.payload as PlantType
                payload.key = payload.id
                nextState.plantTypes[payload.id] = payload;
                nextState.totalPlantTypes += 1;
                return nextState;
            }
            return state;
        case plantTypeActionTypes.UPDATE_PLANT_TYPE_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalPlantTypes: state.totalPlantTypes, plantTypes: {...state.plantTypes} } as PlantTypesDataState;
                let payload = action.payload as PlantType
                payload.key = payload.id
                nextState.plantTypes[payload.id] = payload;
                return nextState;
            }
            return state;
        case plantTypeActionTypes.DELETE_PLANT_TYPE_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalPlantTypes: state.totalPlantTypes, plantTypes: {...state.plantTypes} } as PlantTypesDataState;
                Reflect.deleteProperty(nextState.plantTypes, action.payload as number)
                nextState.totalPlantTypes -= 1;
                return nextState;
            }
            return state;
        
        default:
            return state;
    }
};

export const searchPlantTypesDataReducer = (state = { totalPlantTypes: 0, plantTypes: {} }, action: UnknownAction ): PlantTypesDataState => {
    switch(action.type) {
        case plantTypeActionTypes.SEARCH_PLANT_TYPES_SUCCEEDED:
            if (action.payload) {
                let plantTypesDataState: PlantTypesDataState = { totalPlantTypes: state.totalPlantTypes, plantTypes: { ...state.plantTypes} }
                let payload = action.payload as [PlantType]
                for (let i = 0; i < payload.length; i++) {
                    if (payload[i]?.id) {
                        payload[i].key = payload[i].id
                        plantTypesDataState.plantTypes[payload[i].id] = payload[i]
                    }
                }
                const nextState: PlantTypesDataState = plantTypesDataState;
                return nextState;
            }
            return state;
        default:
            return state;
    }
}