import { UnknownAction } from "redux";
import { User, UsersDataState } from "../../types/user";
import userActionTypes from "../actionTypes/userActionTypes";
import { PaginatedResponse } from "../../types/pagination";

export const usersDataReducer = (state = { loading: false, totalUsers: 0, users: {}, paginationMapping: {} }, action: UnknownAction): UsersDataState => {
    switch (action.type) {
        case userActionTypes.GET_USERS_SUCCEEDED:
            if (action.payload) {
                let usersDataState: UsersDataState = {
                    loading: state.loading,
                    totalUsers: state.totalUsers,
                    users: { ...state.users },
                    paginationMapping: { ...state.paginationMapping }
                };
                let payload = action.payload as PaginatedResponse<User>;
                const offset = payload.offset;

                if (payload.offset === 0) {
                    usersDataState.users = {}
                    usersDataState.paginationMapping = {}
                }

                let users = payload.results;
                for (let i = 0; i < users.length; i++) {
                    if (users[i]?.id) {
                        users[i].key = users[i].id
                        usersDataState.users[users[i].id] = users[i]
                        usersDataState.paginationMapping[offset + i] = users[i].id
                    }
                }
                return { ...usersDataState, loading: false, totalUsers: payload.total };
            }
            return state;

        case userActionTypes.GET_USERS_REQUESTED:
            return { totalUsers: state.totalUsers, users: { ...state.users }, paginationMapping: { ...state.paginationMapping }, loading: true };

        case userActionTypes.GET_USERS_FAILED:
            return { totalUsers: state.totalUsers, users: { ...state.users }, paginationMapping: { ...state.paginationMapping }, loading: false };

        case userActionTypes.CREATE_USER_SUCCEEDED:
            if (action.payload) {
                const nextState = { 
                    loading: state.loading,
                    totalUsers: state.totalUsers, 
                    users: { ...state.users },
                    paginationMapping: { ...state.paginationMapping }
                } as UsersDataState;

                let payload = action.payload as User
                payload.key = payload.id
                nextState.users[payload.id] = payload;
                nextState.totalUsers += 1;
                return nextState;
            }
            return state;

        case userActionTypes.UPDATE_USER_SUCCEEDED:
            if (action.payload) {
                const nextState = { 
                    loading: state.loading,
                    totalUsers: state.totalUsers, 
                    users: { ...state.users },
                    paginationMapping: { ...state.paginationMapping }
                } as UsersDataState;

                let payload = action.payload as User
                payload.key = payload.id
                nextState.users[payload.id] = payload;
                return nextState;
            }
            return state;
        case userActionTypes.DELETE_USER_SUCCEEDED:
            if (action.payload) {
                const nextState = { 
                    loading: state.loading,
                    totalUsers: state.totalUsers, 
                    users: { ...state.users },
                    paginationMapping: { ...state.paginationMapping }
                } as UsersDataState;

                Reflect.deleteProperty(nextState.users, action.payload as number)
                nextState.totalUsers -= 1;
                return nextState;
            }
            return state;

        default:
            return state;
    }
};

export const searchUsersDataReducer = (state = { loading: false, totalUsers: 0, users: {}, paginationMapping: {} }, action: UnknownAction): UsersDataState => {
    switch (action.type) {
        case userActionTypes.SEARCH_USERS_SUCCEEDED:
            if (action.payload) {
                let usersDataState: UsersDataState = {
                    loading: state.loading,
                    totalUsers: state.totalUsers,
                    users: { ...state.users },
                    paginationMapping: { ...state.paginationMapping }
                };
                let payload = action.payload as PaginatedResponse<User>;
                const offset = payload.offset;

                if (payload.offset === 0) {
                    usersDataState.users = {}
                    usersDataState.paginationMapping = {}
                }

                let users = payload.results;
                for (let i = 0; i < users.length; i++) {
                    if (users[i]?.id) {
                        users[i].key = users[i].id
                        usersDataState.users[users[i].id] = users[i]
                        usersDataState.paginationMapping[offset + i] = users[i].id
                    }
                }
                return { ...usersDataState, loading: false, totalUsers: payload.total };
            }
            return state;
        default:
            return state;
    }
}