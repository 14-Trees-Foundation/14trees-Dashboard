import { UnknownAction } from "redux";
import { User, UsersDataState } from "../../types/user";
import userActionTypes from "../actionTypes/userActionTypes";
import { fetchDataFromLocal } from "../../api/apiClient/apiClient";

export const usersDataReducer = (state = fetchDataFromLocal("usersDataState"), action: UnknownAction ): UsersDataState => {
    switch (action.type) {
        case userActionTypes.GET_USERS_SUCCEEDED:
            if (action.payload) {
                let usersDataState: UsersDataState = {}
                let payload = action.payload as [User]
                for (let i = 0; i < payload.length; i++) {
                    if (payload[i]?._id) {
                        payload[i].key = payload[i]._id
                        usersDataState[payload[i]._id] = payload[i]
                    }
                }
                const nextState: UsersDataState = usersDataState;
                return nextState;
            }
            return state;
        case userActionTypes.CREATE_USER_SUCCEEDED:
            if (action.payload) {
                const nextState = { ...state } as UsersDataState;
                let payload = action.payload as User
                payload.key = payload._id
                nextState[payload._id] = payload;
                return nextState;
            }
            return state;
        case userActionTypes.UPDATE_USER_SUCCEEDED:
            if (action.payload) {
                const nextState = { ...state } as UsersDataState;
                let payload = action.payload as User
                payload.key = payload._id
                nextState[payload._id] = payload;
                return nextState;
            }
            return state;
        case userActionTypes.DELETE_USER_SUCCEEDED:
            if (action.payload) {
                const nextState = { ...state } as UsersDataState;
                Reflect.deleteProperty(nextState, action.payload as string)
                return nextState;
            }
            return state;
        
        default:
            return state;
    }
};