import { UnknownAction } from "redux";
import { User, UsersDataState } from "../../types/user";
import userActionTypes from "../actionTypes/userActionTypes";
import { PaginatedResponse } from "../../types/pagination";

export const usersDataReducer = (state = { totalUsers:0, users: {}}, action: UnknownAction ): UsersDataState => {
    switch (action.type) {
        case userActionTypes.GET_USERS_SUCCEEDED:
            if (action.payload) {
                let usersDataState: UsersDataState = { totalUsers: state.totalUsers, users: { ...state.users }};
                let payload = action.payload as PaginatedResponse<User>;
                console.log(payload)
                if (usersDataState.totalUsers != payload.total) {
                    usersDataState.users = {}
                }
                usersDataState.totalUsers = payload.total;
                let users = payload.results;
                for (let i = 0; i < users.length; i++) {
                    if (users[i]?.id) {
                        users[i].key = users[i].id
                        usersDataState.users[users[i].id] = users[i]
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
                payload.key = payload.id
                nextState.users[payload.id] = payload;
                nextState.totalUsers += 1;
                return nextState;
            }
            return state;
        case userActionTypes.UPDATE_USER_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalUsers: state.totalUsers, users: { ...state.users }} as UsersDataState;
                let payload = action.payload as User
                payload.key = payload.id
                nextState.users[payload.id] = payload;
                return nextState;
            }
            return state;
        case userActionTypes.DELETE_USER_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalUsers: state.totalUsers, users: { ...state.users }} as UsersDataState;
                Reflect.deleteProperty(nextState.users, action.payload as number)
                nextState.totalUsers -= 1;
                return nextState;
            }
            return state;
        
        default:
            return state;
    }
};

export const searchUsersDataReducer = (state = { totalUsers:0, users: {}}, action: UnknownAction ): UsersDataState => {
    switch(action.type) {
        case userActionTypes.SEARCH_USERS_SUCCEEDED:
            if (action.payload) {
                let usersDataState: UsersDataState = { totalUsers: state.totalUsers, users: { ...state.users }};
                let payload = action.payload as [User]
                for (let i = 0; i < payload.length; i++) {
                    if (payload[i]?.id) {
                        payload[i].key = payload[i].id
                        usersDataState.users[payload[i].id] = payload[i]
                    }
                }
                const nextState: UsersDataState = usersDataState;
                return nextState;
            }
            return state;
        default:
            return state;
    }
}