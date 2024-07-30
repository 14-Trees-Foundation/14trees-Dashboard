import { UnknownAction } from "redux";
import {  VisitUsersDataState } from "../../types/visits";
import VisitUsersActionTypes from "../actionTypes/visitUserActionTypes";
import { User } from "../../types/user";
import { PaginatedResponse } from "../../types/pagination";



export const visitUsersDataReducer = (state = { totalUsers:0, users: {}}, action: UnknownAction ): VisitUsersDataState => {
    switch (action.type) {
        case VisitUsersActionTypes.GET_VISIT_USERS_SUCCEEDED:
            if (action.payload) {
                let usersDataState: VisitUsersDataState = { totalUsers: state.totalUsers, users: { ...state.users }};
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
                const nextState: VisitUsersDataState = usersDataState;
                return nextState;
            }
            return state;
        case VisitUsersActionTypes.CREATE_VISIT_USER_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalUsers: state.totalUsers, users: { ...state.users }} as VisitUsersDataState;
                let payload = action.payload as User
                payload.key = payload.id
                nextState.users[payload.id] = payload;
                nextState.totalUsers += 1;
                return nextState;
            }
            return state;
        // case VisitUsersActionTypes.CREATE_VISIT_BULK_USERS_SUCCEEDED:
        //     if (action.payload) {
        //         let VistsUserDataState: VisitUsersMappingState = { ...state }
        //         const { visitId, data } = action.payload as any
        //         VistsUserDataState[visitId] = data;    
        //         return VistsUserDataState;
        //     }
        //     return state;

        case VisitUsersActionTypes.DELETE_VISIT_USER_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalUsers: state.totalUsers, users: { ...state.users }} as VisitUsersDataState;
                Reflect.deleteProperty(nextState.users, action.payload as number)
                nextState.totalUsers -= 1;
                return nextState;
            }
            return state;
        
        default:
            return state;
    }
};