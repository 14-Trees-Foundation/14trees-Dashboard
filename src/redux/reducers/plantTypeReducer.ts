import { UnknownAction } from "redux";
import { PlantTypesDataState, PlantType } from "../../types/plantType";
import plantTypeActionTypes from "../actionTypes/plantTypeActionTypes";
import { PaginatedResponse } from "../../types/pagination";

export const plantTypesDataReducer = (state = { loading: false, totalPlantTypes: 0, plantTypes: {}, paginationMapping: {} }, action: UnknownAction): PlantTypesDataState => {
    switch (action.type) {
        case plantTypeActionTypes.GET_PLANT_TYPES_SUCCEEDED:
            if (action.payload) {
                let plantTypesDataState: PlantTypesDataState = {
                    loading: state.loading,
                    totalPlantTypes: state.totalPlantTypes,
                    plantTypes: { ...state.plantTypes },
                    paginationMapping: { ...state.paginationMapping }
                };
                let payload = action.payload as PaginatedResponse<PlantType>;
                const offset = payload.offset;

                if (payload.offset === 0) {
                    plantTypesDataState.plantTypes = {}
                    plantTypesDataState.paginationMapping = {}
                }

                let plantTypes = payload.results;
                for (let i = 0; i < plantTypes.length; i++) {
                    if (plantTypes[i]?.id) {
                        plantTypes[i].key = plantTypes[i].id
                        plantTypesDataState.plantTypes[plantTypes[i].id] = plantTypes[i]
                        plantTypesDataState.paginationMapping[offset + i] = plantTypes[i].id
                    }
                }
                return { ...plantTypesDataState, loading: false, totalPlantTypes: payload.total };
            }
            return state;

        case plantTypeActionTypes.GET_PLANT_TYPES_REQUESTED:
            return { totalPlantTypes: state.totalPlantTypes, plantTypes: { ...state.plantTypes }, paginationMapping: { ...state.paginationMapping }, loading: true };

        case plantTypeActionTypes.GET_PLANT_TYPES_FAILED:
            return { totalPlantTypes: state.totalPlantTypes, plantTypes: { ...state.plantTypes }, paginationMapping: { ...state.paginationMapping }, loading: false };

        case plantTypeActionTypes.CREATE_PLANT_TYPE_SUCCEEDED:
            if (action.payload) {
                const nextState = { 
                    loading: state.loading,
                    totalPlantTypes: state.totalPlantTypes, 
                    plantTypes: { ...state.plantTypes },
                    paginationMapping: { ...state.paginationMapping }
                } as PlantTypesDataState;

                let payload = action.payload as PlantType
                payload.key = payload.id
                nextState.plantTypes[payload.id] = payload;
                nextState.totalPlantTypes += 1;
                return nextState;
            }
            return state;

        case plantTypeActionTypes.UPDATE_PLANT_TYPE_SUCCEEDED:
            if (action.payload) {
                const nextState = { 
                    loading: state.loading,
                    totalPlantTypes: state.totalPlantTypes, 
                    plantTypes: { ...state.plantTypes },
                    paginationMapping: { ...state.paginationMapping }
                } as PlantTypesDataState;

                let payload = action.payload as PlantType
                payload.key = payload.id
                nextState.plantTypes[payload.id] = payload;
                return nextState;
            }
            return state;

        case plantTypeActionTypes.DELETE_PLANT_TYPE_SUCCEEDED:
            if (action.payload) {
                const nextState = { 
                    loading: state.loading,
                    totalPlantTypes: state.totalPlantTypes, 
                    plantTypes: { ...state.plantTypes },
                    paginationMapping: { ...state.paginationMapping }
                } as PlantTypesDataState;

                Reflect.deleteProperty(nextState.plantTypes, action.payload as number)
                nextState.totalPlantTypes -= 1;
                return nextState;
            }
            return state;

        default:
            return state;
    }
};

export const searchPlantTypesDataReducer = (state = { loading: false, totalPlantTypes: 0, plantTypes: {}, paginationMapping: {} }, action: UnknownAction): PlantTypesDataState => {
    switch(action.type) {
        case plantTypeActionTypes.SEARCH_PLANT_TYPES_SUCCEEDED:
            if (action.payload) {
                let plantTypesDataState: PlantTypesDataState = {
                    loading: false,
                    totalPlantTypes: state.totalPlantTypes,
                    plantTypes: { ...state.plantTypes },
                    paginationMapping: { ...state.paginationMapping }
                };
                let payload = action.payload as PlantType[];
                
                // Reset state for new search results
                plantTypesDataState.plantTypes = {};
                plantTypesDataState.paginationMapping = {};
                
                for (let i = 0; i < payload.length; i++) {
                    if (payload[i]?.id) {
                        payload[i].key = payload[i].id
                        plantTypesDataState.plantTypes[payload[i].id] = payload[i]
                        plantTypesDataState.paginationMapping[i] = payload[i].id
                    }
                }
                return plantTypesDataState;
            }
            return state;
        default:
            return state;
    }
}