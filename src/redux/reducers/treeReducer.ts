import { UnknownAction } from "redux";
import { Tree, TreesDataState } from "../../types/tree";
import treeActionTypes from "../actionTypes/treeActionTypes";
import { PaginatedResponse } from "../../types/pagination";

export const treesDataReducer = (state = { totalTrees: 0, trees: {} }, action: UnknownAction ): TreesDataState => {
    switch (action.type) {
        case treeActionTypes.GET_TREES_SUCCEEDED:
            if (action.payload) {
                let treesDataState = { totalTrees: state.totalTrees, trees: { ...state.trees } } as TreesDataState;
                let payload = action.payload as PaginatedResponse<Tree>;
                if (payload.total !== state.totalTrees || payload.offset === 0) {
                    treesDataState.trees = {}
                }
                treesDataState.totalTrees = payload.total;
                let trees = payload.results;
                for (let i = 0; i < trees.length; i++) {
                    if (trees[i]?.id) {
                        trees[i].key = trees[i].id
                        treesDataState.trees[trees[i].id] = trees[i]
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
                payload.key = payload.id
                nextState.trees[payload.id] = payload;
                nextState.totalTrees += 1;
                return nextState;
            }
            return state;
        case treeActionTypes.UPDATE_TREE_SUCCEEDED:
            if (action.payload) {
                let nextState = { totalTrees: state.totalTrees, trees: { ...state.trees } } as TreesDataState;
                let payload = action.payload as Tree
                payload.key = payload.id
                nextState.trees[payload.id] = payload;
                return nextState;
            }
            return state;
        case treeActionTypes.DELETE_TREE_SUCCEEDED:
            if (action.payload) {
                let nextState = { totalTrees: state.totalTrees, trees: { ...state.trees } } as TreesDataState;
                Reflect.deleteProperty(nextState.trees, action.payload as number)
                nextState.totalTrees -= 1;
                return nextState;
            }
            return state;
        
        default:
            return state;
    }
};