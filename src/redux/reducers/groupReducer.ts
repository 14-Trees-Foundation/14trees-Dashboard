import { UnknownAction } from "redux";
import { Group, GroupsDataState } from "../../types/Group";
import groupActionTypes from "../actionTypes/groupActionTypes";
import { PaginatedResponse } from "../../types/pagination";

export const groupsDataReducer = (state = { totalGroups:0, groups: {} }, action: UnknownAction ): GroupsDataState => {
    switch (action.type) {
        case groupActionTypes.GET_GROUPS_SUCCEEDED:
            if (action.payload) {
                let groupsDataState: GroupsDataState = { totalGroups: state.totalGroups, groups: { ...state.groups }}
                let payload = action.payload as PaginatedResponse<Group>
                if (payload.offset === 0) {
                    groupsDataState.groups = {}
                }
                groupsDataState.totalGroups = payload.total
                let groups = payload.results
                for (let i = 0; i < groups.length; i++) {
                    if (groups[i]?.id) {
                        groups[i].key = groups[i].id
                        groupsDataState.groups[groups[i].id] = groups[i]
                    }
                }
                const nextState: GroupsDataState = groupsDataState;
                return nextState;
            }
            return state;
        case groupActionTypes.CREATE_GROUP_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalGroups: state.totalGroups, groups: { ...state.groups } } as GroupsDataState;
                let payload = action.payload as Group
                payload.key = payload.id
                nextState.groups[payload.id] = payload;
                nextState.totalGroups += 1;
                return nextState;
            }
            return state;
        case groupActionTypes.UPDATE_GROUP_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalGroups: state.totalGroups, groups: { ...state.groups } } as GroupsDataState;
                let payload = action.payload as Group
                payload.key = payload.id
                nextState.groups[payload.id] = payload;
                return nextState;
            }
            return state;
        case groupActionTypes.DELETE_GROUP_SUCCEEDED:
            if (action.payload) {
                const nextState = { totalGroups: state.totalGroups, groups: { ...state.groups } } as GroupsDataState;
                Reflect.deleteProperty(nextState.groups, action.payload as number)
                nextState.totalGroups -= 1;
                return nextState;
            }
            return state;
        
        default:
            return state;
    }
};

export const searchGroupsDataReducer = (state = { totalGroups:0, groups: {}}, action: UnknownAction ): GroupsDataState => {
    switch(action.type) {
        case groupActionTypes.SEARCH_GROUPS_SUCCEEDED:
            if (action.payload) {
                let groupsDataState: GroupsDataState = { totalGroups: state.totalGroups, groups: { ...state.groups }};
                let payload = action.payload as PaginatedResponse<Group>
                for (let i = 0; i < payload.results.length; i++) {
                    if (payload.results[i]?.id) {
                        payload.results[i].key = payload.results[i].id
                        groupsDataState.groups[payload.results[i].id] = payload.results[i]
                    }
                }
                const nextState: GroupsDataState = groupsDataState;
                return nextState;
            }
            return state;
        default:
            return state;
    }
}