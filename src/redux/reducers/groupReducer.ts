import { UnknownAction } from "redux";
import { Group, GroupsDataState } from "../../types/Group";
import groupActionTypes from "../actionTypes/groupActionTypes";
import { PaginatedResponse } from "../../types/pagination";

export const groupsDataReducer = (state = { loading: false, totalGroups: 0, groups: {}, paginationMapping: {} }, action: UnknownAction): GroupsDataState => {
    switch (action.type) {
        case groupActionTypes.GET_GROUPS_SUCCEEDED:
            if (action.payload) {
                let groupsDataState: GroupsDataState = {
                    loading: state.loading,
                    totalGroups: state.totalGroups,
                    groups: { ...state.groups },
                    paginationMapping: { ...state.paginationMapping }
                };
                let payload = action.payload as PaginatedResponse<Group>;
                const offset = payload.offset;

                if (payload.offset === 0) {
                    groupsDataState.groups = {}
                    groupsDataState.paginationMapping = {}
                }

                let groups = payload.results;
                for (let i = 0; i < groups.length; i++) {
                    if (groups[i]?.id) {
                        groups[i].key = groups[i].id
                        groupsDataState.groups[groups[i].id] = groups[i]
                        groupsDataState.paginationMapping[offset + i] = groups[i].id
                    }
                }
                return { ...groupsDataState, loading: false, totalGroups: payload.total };
            }
            return state;

        case groupActionTypes.GET_GROUPS_REQUESTED:
            return { totalGroups: state.totalGroups, groups: { ...state.groups }, paginationMapping: { ...state.paginationMapping }, loading: true };

        case groupActionTypes.GET_GROUPS_FAILED:
            return { totalGroups: state.totalGroups, groups: { ...state.groups }, paginationMapping: { ...state.paginationMapping }, loading: false };

        case groupActionTypes.CREATE_GROUP_SUCCEEDED:
            if (action.payload) {
                const nextState = { 
                    loading: state.loading,
                    totalGroups: state.totalGroups, 
                    groups: { ...state.groups },
                    paginationMapping: { ...state.paginationMapping }
                } as GroupsDataState;

                let payload = action.payload as Group
                payload.key = payload.id
                nextState.groups[payload.id] = payload;
                nextState.totalGroups += 1;
                return nextState;
            }
            return state;

        case groupActionTypes.UPDATE_GROUP_SUCCEEDED:
            if (action.payload) {
                const nextState = { 
                    loading: state.loading,
                    totalGroups: state.totalGroups, 
                    groups: { ...state.groups },
                    paginationMapping: { ...state.paginationMapping }
                } as GroupsDataState;

                let payload = action.payload as Group
                payload.key = payload.id
                nextState.groups[payload.id] = payload;
                return nextState;
            }
            return state;

        case groupActionTypes.DELETE_GROUP_SUCCEEDED:
            if (action.payload) {
                const nextState = { 
                    loading: state.loading,
                    totalGroups: state.totalGroups, 
                    groups: { ...state.groups },
                    paginationMapping: { ...state.paginationMapping }
                } as GroupsDataState;

                Reflect.deleteProperty(nextState.groups, action.payload as number)
                nextState.totalGroups -= 1;
                return nextState;
            }
            return state;

        default:
            return state;
    }
};

export const searchGroupsDataReducer = (state = { loading: false, totalGroups: 0, groups: {}, paginationMapping: {} }, action: UnknownAction): GroupsDataState => {
    switch(action.type) {
        case groupActionTypes.SEARCH_GROUPS_SUCCEEDED:
            if (action.payload) {
                let groupsDataState: GroupsDataState = {
                    loading: false,
                    totalGroups: state.totalGroups,
                    groups: { ...state.groups },
                    paginationMapping: { ...state.paginationMapping }
                };
                let payload = action.payload as Group[];
                
                // Reset state for new search results
                groupsDataState.groups = {};
                groupsDataState.paginationMapping = {};
                
                for (let i = 0; i < payload.length; i++) {
                    if (payload[i]?.id) {
                        payload[i].key = payload[i].id
                        groupsDataState.groups[payload[i].id] = payload[i]
                        groupsDataState.paginationMapping[i] = payload[i].id
                    }
                }
                return groupsDataState;
            }
            return state;
        default:
            return state;
    }
}