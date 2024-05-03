import { UnknownAction } from "redux";
import { UserTreesDataState, UserTree } from "../../types/userTree";
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
        case userTreeActionTypes.DELETE_USER_TREE_SUCCEEDED:
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