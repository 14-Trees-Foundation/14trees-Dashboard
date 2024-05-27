import { UnknownAction } from "redux";
import { SearchUsersDataState, User, UserPaginationResponse, UsersDataState } from "../../types/user";
import userActionTypes from "../actionTypes/userActionTypes";
import { fetchDataFromLocal } from "../../api/apiClient/apiClient";

export const usersDataReducer = (state = { totalUsers:0, users: {}}, action: UnknownAction ): UsersDataState => {
    switch (action.type) {
        case userActionTypes.GET_USERS_SUCCEEDED:
            if (action.payload) {
                let usersDataState: UsersDataState = { totalUsers: state.totalUsers, users: { ...state.users }};
                let payload = action.payload as UserPaginationResponse;
                if (usersDataState.totalUsers != payload.total) {
                    usersDataState.users = {}
                }
                usersDataState.totalUsers = payload.total;
                let users = payload.result;
                for (let i = 0; i < users.length; i++) {
                    if (users[i]?._id) {
                        users[i].key = users[i]._id
                        usersDataState.users[users[i]._id] = users[i]
                    }
                }
                const nextState: UsersDataState = usersDataState;
                return nextState;
            }
            return state;
        case userActionTypes.CREATE_USER_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalUsers: state.totalUsers, users: { ...state.users }} as UsersDataState;
                let payload = action.payload as User
                payload.key = payload._id
                nextState.users[payload._id] = payload;
                nextState.totalUsers += 1;
                return nextState;
            }
            return state;
        case userActionTypes.UPDATE_USER_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalUsers: state.totalUsers, users: { ...state.users }} as UsersDataState;
                let payload = action.payload as User
                payload.key = payload._id
                nextState.users[payload._id] = payload;
                return nextState;
            }
            return state;
        case userActionTypes.DELETE_USER_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalUsers: state.totalUsers, users: { ...state.users }} as UsersDataState;
                Reflect.deleteProperty(nextState.users, action.payload as string)
                nextState.totalUsers -= 1;
                return nextState;
            }
            return state;
        
        default:
            return state;
    }
};

export const searchUsersDataReducer = (state = {}, action: UnknownAction): SearchUsersDataState => {
    switch(action.type) {
        case userActionTypes.SEARCH_USERS_SUCCEEDED:
            if (action.payload) {
                let usersDataState: SearchUsersDataState = {}
                let payload = action.payload as [User]
                for (let i = 0; i < payload.length; i++) {
                    if (payload[i]?._id) {
                        payload[i].key = payload[i]._id
                        usersDataState[payload[i]._id] = payload[i]
                    }
                }
                const nextState: SearchUsersDataState = usersDataState;
                return nextState;
            }
            return state;
        default:
            return state;
    }
}