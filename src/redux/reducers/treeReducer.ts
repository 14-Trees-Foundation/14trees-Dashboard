import { UnknownAction } from "redux";
import { Tree, TreesDataState } from "../../types/tree";
import treeActionTypes from "../actionTypes/treeActionTypes";
import { fetchDataFromLocal } from "../../api/apiClient/apiClient";

export const treesDataReducer = (state = fetchDataFromLocal("treesDataState"), action: UnknownAction ): TreesDataState => {
    switch (action.type) {
        case treeActionTypes.GET_TREES_SUCCEEDED:
            if (action.payload) {
                let treesDataState: TreesDataState = {}
                let payload = action.payload as [Tree]
                for (let i = 0; i < payload.length; i++) {
                    if (payload[i]?._id) {
                        payload[i].key = payload[i]._id
                        treesDataState[payload[i]._id] = payload[i]
                    }
                }
                const nextState: TreesDataState = treesDataState;
                return nextState;
            }
            return state;
        case treeActionTypes.CREATE_TREE_SUCCEEDED:
            if (action.payload) {
                const nextState = { ...state } as TreesDataState;
                let payload = action.payload as Tree
                payload.key = payload._id
                nextState[payload._id] = payload;
                return nextState;
            }
            return state;
        case treeActionTypes.UPDATE_TREE_SUCCEEDED:
            if (action.payload) {
                const nextState = { ...state } as TreesDataState;
                let payload = action.payload as Tree
                payload.key = payload._id
                nextState[payload._id] = payload;
                return nextState;
            }
            return state;
        case treeActionTypes.DELETE_TREE_SUCCEEDED:
            if (action.payload) {
                const nextState = { ...state } as TreesDataState;
                Reflect.deleteProperty(nextState, action.payload as string)
                return nextState;
            }
            return state;
        
        default:
            return state;
    }
};