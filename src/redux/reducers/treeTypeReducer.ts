import { UnknownAction } from "redux";
import { TreeTypesDataState, TreeType, TreeTypePaginationResponse } from "../../types/treeType";
import treeTypeActionTypes from "../actionTypes/treeTypeActionTypes";
import { fetchDataFromLocal } from "../../api/apiClient/apiClient";

export const treeTypesDataReducer = (state = { totalTreeTypes: 0, treeTypes: {} }, action: UnknownAction ): TreeTypesDataState => {
    switch (action.type) {
        case treeTypeActionTypes.GET_TREE_TYPES_SUCCEEDED:
            if (action.payload) {
                let treeTypesDataState: TreeTypesDataState = { totalTreeTypes: state.totalTreeTypes, treeTypes: { ...state.treeTypes} }
                let payload = action.payload as TreeTypePaginationResponse
                if (treeTypesDataState.totalTreeTypes !== payload.total) {
                    treeTypesDataState.treeTypes = {}
                }
                treeTypesDataState.totalTreeTypes = payload.total;
                let treeTypes = payload.result
                for (let i = 0; i < treeTypes.length; i++) {
                    if (treeTypes[i]?._id) {
                        treeTypes[i].key = treeTypes[i]._id
                        treeTypesDataState.treeTypes[treeTypes[i]._id] = treeTypes[i]
                    }
                }
                const nextState: TreeTypesDataState = treeTypesDataState;
                return nextState;
            }
            return state;
        case treeTypeActionTypes.CREATE_TREE_TYPE_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalTreeTypes: state.totalTreeTypes, treeTypes: {...state.treeTypes} } as TreeTypesDataState;
                let payload = action.payload as TreeType
                payload.key = payload._id
                nextState.treeTypes[payload._id] = payload;
                nextState.totalTreeTypes += 1;
                return nextState;
            }
            return state;
        case treeTypeActionTypes.UPDATE_TREE_TYPE_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalTreeTypes: state.totalTreeTypes, treeTypes: {...state.treeTypes} } as TreeTypesDataState;
                let payload = action.payload as TreeType
                payload.key = payload._id
                nextState.treeTypes[payload._id] = payload;
                return nextState;
            }
            return state;
        case treeTypeActionTypes.DELETE_TREE_TYPE_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalTreeTypes: state.totalTreeTypes, treeTypes: {...state.treeTypes} } as TreeTypesDataState;
                Reflect.deleteProperty(nextState.treeTypes, action.payload as string)
                nextState.totalTreeTypes -= 1;
                return nextState;
            }
            return state;
        
        default:
            return state;
    }
};

export const searchTreeTypesDataReducer = (state = { totalTreeTypes: 0, treeTypes: {} }, action: UnknownAction ): TreeTypesDataState => {
    switch(action.type) {
        case treeTypeActionTypes.SEARCH_TREE_TYPES_SUCCEEDED:
            if (action.payload) {
                let treeTypesDataState: TreeTypesDataState = { totalTreeTypes: state.totalTreeTypes, treeTypes: { ...state.treeTypes} }
                let payload = action.payload as [TreeType]
                for (let i = 0; i < payload.length; i++) {
                    if (payload[i]?._id) {
                        payload[i].key = payload[i]._id
                        treeTypesDataState.treeTypes[payload[i]._id] = payload[i]
                    }
                }
                const nextState: TreeTypesDataState = treeTypesDataState;
                return nextState;
            }
            return state;
        default:
            return state;
    }
}