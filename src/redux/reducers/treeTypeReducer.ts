import { UnknownAction } from "redux";
import { TreeTypesDataState, TreeType } from "../../types/treeType";
import treeTypeActionTypes from "../actionTypes/treeTypeActionTypes";
import { fetchDataFromLocal } from "../../api/apiClient/apiClient";

export const treeTypesDataReducer = (state = fetchDataFromLocal("treeTypesDataState"), action: UnknownAction ): TreeTypesDataState => {
    switch (action.type) {
        case treeTypeActionTypes.GET_TREE_TYPES_SUCCEEDED:
            if (action.payload) {
                let treeTypesDataState: TreeTypesDataState = {}
                let payload = action.payload as [TreeType]
                for (let i = 0; i < payload.length; i++) {
                    if (payload[i]?._id) {
                        payload[i].key = payload[i]._id
                        treeTypesDataState[payload[i]._id] = payload[i]
                    }
                }
                const nextState: TreeTypesDataState = treeTypesDataState;
                return nextState;
            }
            return state;
        case treeTypeActionTypes.CREATE_TREE_TYPE_SUCCEEDED:
            if (action.payload) {
                const nextState = { ...state } as TreeTypesDataState;
                let payload = action.payload as TreeType
                payload.key = payload._id
                nextState[payload._id] = payload;
                return nextState;
            }
            return state;
        case treeTypeActionTypes.UPDATE_TREE_TYPE_SUCCEEDED:
            if (action.payload) {
                const nextState = { ...state } as TreeTypesDataState;
                let payload = action.payload as TreeType
                payload.key = payload._id
                nextState[payload._id] = payload;
                return nextState;
            }
            return state;
        case treeTypeActionTypes.DELETE_TREE_TYPE_SUCCEEDED:
            if (action.payload) {
                const nextState = { ...state } as TreeTypesDataState;
                Reflect.deleteProperty(nextState, action.payload as string)
                return nextState;
            }
            return state;
        
        default:
            return state;
    }
};