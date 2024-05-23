import { UnknownAction } from "redux";
import { PaginationTreeResponse, Tree, TreesDataState } from "../../types/tree";
import treeActionTypes from "../actionTypes/treeActionTypes";

export const treesDataReducer = (state = { totalTrees: 0, trees: {} }, action: UnknownAction ): TreesDataState => {
    switch (action.type) {
        case treeActionTypes.GET_TREES_SUCCEEDED:
            if (action.payload) {
                let treesDataState = { totalTrees: state.totalTrees, trees: { ...state.trees } } as TreesDataState;
                let payload = action.payload as PaginationTreeResponse;
                if (treesDataState.totalTrees !== payload.total) {
                    treesDataState.trees = {}
                }
                treesDataState.totalTrees = payload.total;
                let trees = payload.results;
                for (let i = 0; i < trees.length; i++) {
                    if (trees[i]?._id) {
                        trees[i].key = trees[i]._id
                        treesDataState.trees[trees[i]._id] = trees[i]
                    }
                }
                const nextState: TreesDataState = treesDataState;
                return nextState;
            }
            return state;
        case treeActionTypes.CREATE_TREE_SUCCEEDED:
            if (action.payload) {
                let nextState = { totalTrees: state.totalTrees, trees: { ...state.trees } } as TreesDataState;
                let payload = action.payload as Tree
                payload.key = payload._id
                nextState.trees[payload._id] = payload;
                nextState.totalTrees += 1;
                return nextState;
            }
            return state;
        case treeActionTypes.UPDATE_TREE_SUCCEEDED:
            if (action.payload) {
                let nextState = { totalTrees: state.totalTrees, trees: { ...state.trees } } as TreesDataState;
                let payload = action.payload as Tree
                payload.key = payload._id
                nextState.trees[payload._id] = payload;
                return nextState;
            }
            return state;
        case treeActionTypes.DELETE_TREE_SUCCEEDED:
            if (action.payload) {
                let nextState = { totalTrees: state.totalTrees, trees: { ...state.trees } } as TreesDataState;
                Reflect.deleteProperty(nextState.trees, action.payload as string)
                nextState.totalTrees -= 1;
                return nextState;
            }
            return state;
        
        default:
            return state;
    }
};