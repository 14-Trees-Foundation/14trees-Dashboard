import { UnknownAction } from "redux";
import { UserTreesDataState, UserTree, UserTreeCountDataState, UserTreeCountPaginationResponse } from "../../types/userTree";
import userTreeActionTypes from "../actionTypes/userTreeActionTypes";
import { fetchDataFromLocal } from "../../api/apiClient/apiClient";

export const userTreesDataReducer = (state = fetchDataFromLocal("userTreesDataState"), action: UnknownAction ): UserTreesDataState => {
    switch (action.type) {
        case userTreeActionTypes.GET_USER_TREES_SUCCEEDED:
            if (action.payload) {
                let userTreesDataState: UserTreesDataState = {}
                let payload = action.payload as [UserTree]
                for (let i = 0; i < payload.length; i++) {
                    if (payload[i]?._id) {
                        payload[i].key = payload[i]._id
                        userTreesDataState[payload[i]._id] = payload[i]
                    }
                }
                const nextState: UserTreesDataState = userTreesDataState;
                return nextState;
            }
            return state;
        case userTreeActionTypes.CREATE_USER_TREE_SUCCEEDED:
            if (action.payload) {
                const nextState = { ...state } as UserTreesDataState;
                let payload = action.payload as UserTree
                payload.key = payload._id
                nextState[payload._id] = payload;
                return nextState;
            }
            return state;
        case userTreeActionTypes.UPDATE_USER_TREE_SUCCEEDED:
            if (action.payload) {
                const nextState = { ...state } as UserTreesDataState;
                let payload = action.payload as UserTree
                payload.key = payload._id
                nextState[payload._id] = payload;
                return nextState;
            }
            return state;
        case userTreeActionTypes.UNASSIGN_USER_TREES_SUCCEEDED:
            if (action.payload) {
                const nextState = { ...state } as UserTreesDataState;
                Reflect.deleteProperty(nextState, action.payload as string)
                return nextState;
            }
            return state;
        
        default:
            return state;
    }
};

export const userTreeCountDataReducer = (state = { results: [], totalResults: 0}, action: UnknownAction ): UserTreeCountDataState => {
    switch (action.type) {
        case userTreeActionTypes.GET_USER_TREE_COUNT_SUCCEEDED:
            if (action.payload) {
                let userTreeCountDataState: UserTreeCountDataState = { ...state }
                let payload = action.payload as UserTreeCountPaginationResponse
                if (!userTreeCountDataState || userTreeCountDataState.totalResults != payload.total) {
                    userTreeCountDataState = {
                        totalResults: payload.total,
                        results: []
                    }
                }
                for (let i = 0; i < payload.result_count; i++) {
                    userTreeCountDataState.results.push(payload.result[i]);
                }
                const nextState: UserTreeCountDataState = userTreeCountDataState;
                return nextState;
            }
            return state;
        
        default:
            return state;
    }
};